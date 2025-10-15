-- Migration: Transition from Room-based to Tag-based system
-- This migration safely converts existing rooms to tags and migrates post relationships

-- Step 1: Create the new tables
CREATE TABLE IF NOT EXISTS "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "official" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "post_tags" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("postId","tagId")
);

-- Step 2: Create unique constraint for tag names
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- Step 2.5: Create PostVote table for tracking user upvotes
CREATE TABLE IF NOT EXISTS "post_votes" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_votes_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint to prevent duplicate votes
CREATE UNIQUE INDEX "post_votes_postId_userId_key" ON "post_votes"("postId","userId");

-- Step 3: Migrate existing rooms to tags (mark as official)
INSERT INTO "tags" ("id", "name", "official", "createdAt")
SELECT 
    "id", 
    LOWER("slug"), 
    true, 
    "createdAt"
FROM "rooms"
WHERE NOT EXISTS (
    SELECT 1 FROM "tags" WHERE "name" = LOWER("rooms"."slug")
);

-- Step 4: Create post-tag relationships from existing room relationships
INSERT INTO "post_tags" ("postId", "tagId")
SELECT 
    "posts"."id" as "postId",
    "rooms"."id" as "tagId"
FROM "posts"
JOIN "rooms" ON "posts"."roomId" = "rooms"."id"
WHERE NOT EXISTS (
    SELECT 1 FROM "post_tags" 
    WHERE "post_tags"."postId" = "posts"."id" 
    AND "post_tags"."tagId" = "rooms"."id"
);

-- Step 5: Remove roomId column from posts (after data migration)
-- Note: This will be handled by Prisma in the next migration step
-- ALTER TABLE "posts" DROP COLUMN "roomId";

-- Step 6: Drop the rooms table (after verification)
-- Note: This will be handled by Prisma in the next migration step
-- DROP TABLE "rooms";
