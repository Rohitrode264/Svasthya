# Migration Guide: Rooms to Tags

This guide explains how to migrate from the room-based discussion system to the new tag-based system.

## Overview

The migration involves:
1. **Schema Changes**: Replace `Room` model with `Tag` and `PostTag` models
2. **Data Migration**: Convert existing rooms to tags and migrate post relationships
3. **API Changes**: Replace room-based endpoints with tag-based endpoints
4. **Upvote System**: Implement proper user-based upvoting with `PostVote` model

## Migration Steps

### 1. Backup Your Database
```bash
# Create a backup before starting
pg_dump your_database > backup_before_migration.sql
```

### 2. Run the Data Migration Script
```bash
cd backend
node migrate-rooms-to-tags.js
```

This script will:
- Convert all existing rooms to tags (marked as `official: true`)
- Create post-tag relationships for all existing posts
- Preserve all existing data

### 3. Apply Schema Changes
```bash
# Generate and apply the new schema
npx prisma generate
npx prisma db push
```

### 4. Test the Migration
```bash
# Start your backend server
npm run dev

# Test the new endpoints
curl http://localhost:5000/api/tags
curl http://localhost:5000/api/posts
```

### 5. Clean Up (After Verification)
Once you've verified everything works:

```sql
-- Remove the old roomId column from posts
ALTER TABLE "posts" DROP COLUMN "roomId";

-- Drop the rooms table
DROP TABLE "rooms";
```

## API Changes

### Old Room Endpoints (Removed)
- `GET /api/rooms` → **REMOVED**
- `POST /api/rooms` → **REMOVED**
- `GET /api/rooms/:slug/posts` → **REMOVED**

### New Tag Endpoints
- `GET /api/tags` - List all tags (with filtering)
- `POST /api/tags` - Create a new tag (authenticated)
- `GET /api/tags/:id` - Get tag with posts
- `PATCH /api/tags/:id/verify` - Verify/unverify tag (admin)
- `DELETE /api/tags/:id` - Delete tag (admin)

### Updated Post Endpoints
- `GET /api/posts` - Now supports tag filtering (`?tag=mentalhealth`)
- `POST /api/posts` - Now requires `tags` array instead of `roomId`
- `PATCH /api/posts/:id/upvote` - Now requires authentication and tracks user votes

## New Features

### 1. Tag-Based System
- **Multi-tag support**: Posts can have multiple tags
- **User-created tags**: Users can create new tags (unverified by default)
- **Admin verification**: Admins can mark tags as official
- **Tag filtering**: Filter posts by one or multiple tags

### 2. Improved Upvoting
- **One vote per user**: Users can only upvote each post once
- **Toggle voting**: Users can remove their upvote by upvoting again
- **Vote tracking**: System tracks who voted for what
- **Vote status**: API responses include `userHasUpvoted` field

### 3. Enhanced Search
- **Tag-based search**: `GET /api/posts?tag=mentalhealth`
- **Multi-tag search**: `GET /api/posts?tags=mentalhealth,anxiety`
- **Text search**: `GET /api/posts?search=medication`
- **Combined filters**: Mix tag and text search

## Request/Response Examples

### Create Post (New Format)
```json
POST /api/posts
{
  "title": "Managing Anxiety",
  "body": "Looking for advice on anxiety management...",
  "userAlias": "Anonymous",
  "tags": ["mentalhealth", "anxiety", "advice"]
}
```

### Get Posts with Tag Filter
```json
GET /api/posts?tag=mentalhealth&limit=10

Response:
[
  {
    "id": "post-id",
    "title": "Managing Anxiety",
    "body": "Looking for advice...",
    "upvotes": 5,
    "userHasUpvoted": true,
    "tags": [
      {
        "tag": {
          "id": "tag-id",
          "name": "mentalhealth",
          "official": true
        }
      }
    ],
    "_count": {
      "comments": 3
    }
  }
]
```

### Upvote Post
```json
PATCH /api/posts/:id/upvote
Authorization: Bearer <token>

Response:
{
  "id": "post-id",
  "upvotes": 6,
  "userHasUpvoted": true,
  // ... other post fields
}
```

## Database Schema Changes

### New Models
```prisma
model Tag {
  id         String   @id @default(uuid())
  name       String   @unique
  official   Boolean  @default(false)
  createdBy  String?
  createdAt  DateTime @default(now())
  posts      PostTag[]
}

model PostTag {
  postId String
  tagId  String
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([postId, tagId])
}

model PostVote {
  id     String @id @default(uuid())
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String
  user   user   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
  createdAt DateTime @default(now())
  @@unique([postId, userId])
}
```

### Updated Models
```prisma
model Post {
  // ... existing fields
  tags      PostTag[]  // NEW: Many-to-many with tags
  votes     PostVote[] // NEW: Track user votes
  // roomId  String     // REMOVED: No longer needed
  // room    Room       // REMOVED: No longer needed
}

model user {
  // ... existing fields
  postVotes PostVote[] // NEW: Track user votes
}
```

## Rollback Plan

If you need to rollback:

1. **Restore database backup**:
   ```bash
   psql your_database < backup_before_migration.sql
   ```

2. **Revert code changes**:
   ```bash
   git checkout <previous-commit>
   ```

3. **Reinstall dependencies**:
   ```bash
   npm install
   ```

## Testing Checklist

- [ ] All existing posts are accessible
- [ ] Posts show correct tags (converted from rooms)
- [ ] Tag filtering works (`/api/posts?tag=...`)
- [ ] Post creation works with tags
- [ ] Upvoting works (one vote per user)
- [ ] Upvote toggling works (vote/unvote)
- [ ] Admin tag verification works
- [ ] Search functionality works
- [ ] No broken references to old room endpoints

## Support

If you encounter issues during migration:

1. Check the migration script output for errors
2. Verify your database connection
3. Ensure you have proper permissions
4. Check the Prisma schema is correctly applied

The migration is designed to be safe and reversible, but always backup your data first!
