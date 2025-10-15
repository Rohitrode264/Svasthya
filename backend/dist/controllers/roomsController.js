import prisma from "../prisma/client.js";
export async function listRooms(req, res) {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.json(rooms);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to list rooms" });
    }
}
export async function createRoom(req, res) {
    try {
        const { slug, title, description } = req.body ?? {};
        if (!slug || !title) {
            return res.status(400).json({ error: "slug and title are required" });
        }
        const room = await prisma.room.create({
            data: { slug, title, description: description ?? null },
        });
        return res.status(201).json(room);
    }
    catch (error) {
        if (error?.code === "P2002") {
            return res.status(409).json({ error: "Room slug already exists" });
        }
        return res.status(500).json({ error: "Failed to create room" });
    }
}
export async function getRoomPostsBySlug(req, res) {
    try {
        const { slug } = req.params;
        if (!slug)
            return res.status(400).json({ error: "slug is required" });
        const room = await prisma.room.findUnique({ where: { slug } });
        if (!room)
            return res.status(404).json({ error: "Room not found" });
        const posts = await prisma.post.findMany({
            where: { roomId: room.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                roomId: true,
                userId: true,
                userAlias: true,
                title: true,
                body: true,
                upvotes: true,
                createdAt: true,
                _count: { select: { comments: true } },
            },
        });
        return res.json({ room, posts });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch posts for room" });
    }
}
//# sourceMappingURL=roomsController.js.map