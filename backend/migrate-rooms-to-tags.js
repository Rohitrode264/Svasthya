#!/usr/bin/env node

/**
 * Migration script to transition from room-based to tag-based system
 * This script safely migrates existing data and handles the schema changes
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting migration from rooms to tags...');

    try {

        const existingTags = await prisma.tag.findFirst();
        if (existingTags) {
            console.log('⚠️  Tags already exist. Migration may have already been run.');
            console.log('   If you want to re-run, please reset your database first.');
            return;
        }

        const rooms = await prisma.room.findMany({
            include: {
                posts: true
            }
        });

        console.log(`📊 Found ${rooms.length} rooms to migrate`);

        if (rooms.length === 0) {
            console.log('✅ No rooms found. Migration complete.');
            return;
        }

        console.log('🏷️  Creating tags from rooms...');

        for (const room of rooms) {
            const tagName = room.slug.toLowerCase();

            // Create tag (mark as official since it was a room)
            const tag = await prisma.tag.create({
                data: {
                    id: room.id, // Use same ID to maintain relationships
                    name: tagName,
                    official: true,
                    createdBy: null, // Rooms didn't have creators
                    createdAt: room.createdAt
                }
            });

            console.log(`   ✅ Created tag: ${tag.name} (${room.posts.length} posts)`);

            if (room.posts.length > 0) {
                await prisma.postTag.createMany({
                    data: room.posts.map(post => ({
                        postId: post.id,
                        tagId: tag.id
                    }))
                });
            }
        }

        // Step 4: Verify migration
        const tagCount = await prisma.tag.count();
        const postTagCount = await prisma.postTag.count();
        const postCount = await prisma.post.count();

        console.log('\n📈 Migration Summary:');
        console.log(`   Tags created: ${tagCount}`);
        console.log(`   Post-tag relationships: ${postTagCount}`);
        console.log(`   Total posts: ${postCount}`);

        // Step 5: Show next steps
        console.log('\n🎯 Next Steps:');
        console.log('   1. Run: npx prisma db push (to apply schema changes)');
        console.log('   2. Test your application');
        console.log('   3. Once verified, manually drop the rooms table:');
        console.log('      DROP TABLE "rooms";');
        console.log('   4. Remove roomId column from posts table:');
        console.log('      ALTER TABLE "posts" DROP COLUMN "roomId";');

        console.log('\n✅ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
main()
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
