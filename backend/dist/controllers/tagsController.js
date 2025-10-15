import prisma from "../prisma/client.js";
export async function listTags(req, res) {
    try {
        const { official, search } = req.query;
        const where = {};
        if (official !== undefined) {
            where.official = official === 'true';
        }
        if (search && typeof search === 'string') {
            where.name = {
                contains: search.toLowerCase(),
                mode: 'insensitive'
            };
        }
        const tags = await prisma.tag.findMany({
            where,
            orderBy: [
                { official: 'desc' }, // Official tags first
                { createdAt: 'desc' }
            ],
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
        return res.json(tags);
    }
    catch (error) {
        console.error('Error listing tags:', error);
        return res.status(500).json({ error: "Failed to list tags" });
    }
}
export async function createTag(req, res) {
    try {
        const { name } = req.body ?? {};
        const user = req.user;
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: "Tag name is required" });
        }
        const normalizedName = name.toLowerCase().trim();
        if (normalizedName.length === 0) {
            return res.status(400).json({ error: "Tag name cannot be empty" });
        }
        const tag = await prisma.tag.upsert({
            where: { name: normalizedName },
            update: {}, // Don't update if exists
            create: {
                name: normalizedName,
                official: false,
                createdBy: user?.id || null
            },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
        return res.status(201).json(tag);
    }
    catch (error) {
        console.error('Error creating tag:', error);
        if (error?.code === "P2002") {
            return res.status(409).json({ error: "Tag already exists" });
        }
        return res.status(500).json({ error: "Failed to create tag" });
    }
}
export async function verifyTag(req, res) {
    try {
        const { id } = req.params;
        const { official } = req.body ?? {};
        if (!id) {
            return res.status(400).json({ error: "Tag ID is required" });
        }
        if (typeof official !== 'boolean') {
            return res.status(400).json({ error: "Official status (boolean) is required" });
        }
        const tag = await prisma.tag.update({
            where: { id },
            data: { official },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
        return res.json(tag);
    }
    catch (error) {
        console.error('Error verifying tag:', error);
        if (error?.code === "P2025") {
            return res.status(404).json({ error: "Tag not found" });
        }
        return res.status(500).json({ error: "Failed to verify tag" });
    }
}
export async function deleteTag(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Tag ID is required" });
        }
        const tagWithPosts = await prisma.tag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
        if (!tagWithPosts) {
            return res.status(404).json({ error: "Tag not found" });
        }
        if (tagWithPosts._count.posts > 0) {
            return res.status(400).json({
                error: "Cannot delete tag with associated posts. Remove posts first or merge with another tag."
            });
        }
        await prisma.tag.delete({
            where: { id }
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting tag:', error);
        if (error?.code === "P2025") {
            return res.status(404).json({ error: "Tag not found" });
        }
        return res.status(500).json({ error: "Failed to delete tag" });
    }
}
export async function getTagById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Tag ID is required" });
        }
        const tag = await prisma.tag.findUnique({
            where: { id },
            include: {
                posts: {
                    include: {
                        post: {
                            select: {
                                id: true,
                                title: true,
                                body: true,
                                upvotes: true,
                                createdAt: true,
                                userAlias: true,
                                _count: {
                                    select: { comments: true }
                                }
                            }
                        }
                    },
                    orderBy: {
                        post: {
                            createdAt: 'desc'
                        }
                    }
                },
                _count: {
                    select: { posts: true }
                }
            }
        });
        if (!tag) {
            return res.status(404).json({ error: "Tag not found" });
        }
        const transformedTag = {
            ...tag,
            posts: tag.posts.map(pt => pt.post)
        };
        return res.json(transformedTag);
    }
    catch (error) {
        console.error('Error getting tag:', error);
        return res.status(500).json({ error: "Failed to fetch tag" });
    }
}
//# sourceMappingURL=tagsController.js.map