import prisma from "../prisma/client.js";
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "name, email, and password are required" });
        }
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: "User already exists" });
        }
        const user = await prisma.user.create({
            data: { name, email, password },
        });
        res.status(201).json(user);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getUserOverview = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                medications: {
                    include: {
                        schedules: true,
                        reminders: {
                            where: { sent: false },
                            orderBy: { scheduledAt: "asc" },
                        },
                    },
                },
                doseLogs: {
                    include: {
                        medication: { select: { name: true, brand: true } },
                    },
                    orderBy: { takenAt: "desc" },
                    take: 10,
                },
                alerts: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const existing = await prisma.user.findUnique({ where: { id: userId } });
        if (!existing) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name: name ?? existing.name, email: email ?? existing.email },
        });
        res.json(updatedUser);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const existing = await prisma.user.findUnique({ where: { id: userId } });
        if (!existing) {
            return res.status(404).json({ error: "User not found" });
        }
        await prisma.user.delete({ where: { id: userId } });
        res.json({ message: "User and related data deleted successfully" });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: { medications: true, doseLogs: true, alerts: true },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const recentDoses = await prisma.doseLog.count({
            where: {
                userId,
                takenAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        });
        const missedDoses = await prisma.doseLog.count({
            where: {
                userId,
                status: "MISSED",
                takenAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
        });
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            _count: user._count,
            recentDoses,
            missedDoses,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getUserRecentActivity = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10 } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const recentDoseLogs = await prisma.doseLog.findMany({
            where: { userId },
            include: {
                medication: {
                    select: { name: true, brand: true }
                }
            },
            orderBy: { takenAt: "desc" },
            take: Math.floor(Number(limit) / 2)
        });
        const recentMedications = await prisma.medication.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: Math.floor(Number(limit) / 2)
        });
        const recentPosts = await prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: Math.floor(Number(limit) / 3)
        });
        const activities = [
            ...recentDoseLogs.map(log => ({
                id: log.id,
                type: log.status === "TAKEN" ? "dose_taken" : log.status === "MISSED" ? "dose_missed" : "dose_skipped",
                description: `${log.status === "TAKEN" ? "Took" : log.status === "MISSED" ? "Missed" : "Skipped"} dose of ${log.medication.name}`,
                timestamp: log.takenAt,
                metadata: { medicationId: log.medicationId, status: log.status }
            })),
            ...recentMedications.map(med => ({
                id: med.id,
                type: "medication_added",
                description: `Added medication: ${med.name}`,
                timestamp: med.createdAt,
                metadata: { medicationId: med.id }
            })),
            ...recentPosts.map(post => ({
                id: post.id,
                type: "post_created",
                description: `Created post: ${post.title}`,
                timestamp: post.createdAt,
                metadata: { postId: post.id }
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, Number(limit));
        res.json({ activities });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
//# sourceMappingURL=profilesController.js.map