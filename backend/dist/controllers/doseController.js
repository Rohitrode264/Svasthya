import prisma from "../prisma/client.js";
import { DoseStatus } from "@prisma/client";
import { sendMail } from "../notifications/emailService.js";
export const logDose = async (req, res) => {
    try {
        const { medicationId, userId, status, note } = req.body;
        if (!medicationId || !userId || !status) {
            return res.status(400).json({
                error: "medicationId, userId, and status are required"
            });
        }
        const normalizedStatus = String(status).toUpperCase();
        const validStatuses = [DoseStatus.TAKEN, DoseStatus.MISSED, DoseStatus.SKIPPED];
        if (!validStatuses.includes(normalizedStatus)) {
            return res.status(400).json({
                error: "status must be TAKEN, MISSED, or SKIPPED"
            });
        }
        const medication = await prisma.medication.findUnique({
            where: { id: medicationId },
            include: {
                user: true
            }
        });
        if (!medication) {
            return res.status(404).json({ error: "Medication not found" });
        }
        const log = await prisma.doseLog.create({
            data: {
                medicationId,
                userId: medication.userId,
                status: normalizedStatus,
                note: note || null,
                takenAt: new Date(),
            },
            include: {
                medication: {
                    select: {
                        name: true,
                        brand: true,
                        strength: true
                    }
                }
            }
        });
        if (normalizedStatus === DoseStatus.TAKEN) {
            if (medication.quantity && medication.quantity > 0) {
                await prisma.medication.update({
                    where: { id: medicationId },
                    data: { quantity: { decrement: 1 } },
                });
                if (medication.refillThreshold &&
                    medication.quantity - 1 <= medication.refillThreshold) {
                    if (medication.user.email) {
                        await sendMail(medication.user.email, "Medication Refill Reminder - MediMinder", `Your medication "${medication.name}" is running low. Current quantity: ${medication.quantity - 1}. Please consider refilling soon.`, "MediMinder");
                    }
                }
            }
        }
        await prisma.reminder.updateMany({
            where: {
                medicationId,
                sent: false,
                scheduledAt: {
                    lte: new Date()
                }
            },
            data: { sent: true }
        });
        res.status(201).json(log);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getMedicationDoseLogs = async (req, res) => {
    try {
        const { medicationId } = req.params;
        const { limit = 30, status } = req.query;
        if (!medicationId) {
            return res.status(400).json({ error: "medicationId is required" });
        }
        let whereClause = { medicationId };
        if (status) {
            whereClause.status = status;
        }
        const logs = await prisma.doseLog.findMany({
            where: whereClause,
            include: {
                medication: {
                    select: {
                        name: true,
                        brand: true,
                        strength: true
                    }
                }
            },
            orderBy: {
                takenAt: 'desc'
            },
            take: Number(limit)
        });
        res.json(logs);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getUserDoseLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, status, days = 30 } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        let whereClause = { userId };
        if (status) {
            whereClause.status = status;
        }
        if (days) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - Number(days));
            whereClause.takenAt = {
                gte: startDate
            };
        }
        const logs = await prisma.doseLog.findMany({
            where: whereClause,
            include: {
                medication: {
                    select: {
                        name: true,
                        brand: true,
                        strength: true
                    }
                }
            },
            orderBy: {
                takenAt: 'desc'
            },
            take: Number(limit)
        });
        res.json(logs);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getDoseStatistics = async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 30 } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));
        const stats = await prisma.doseLog.groupBy({
            by: ['status'],
            where: {
                userId,
                takenAt: {
                    gte: startDate
                }
            },
            _count: {
                status: true
            }
        });
        const totalDoses = stats.reduce((sum, stat) => sum + (stat._count?.status || 0), 0);
        const takenDoses = stats.find(s => s.status === 'TAKEN')?._count?.status || 0;
        const missedDoses = stats.find(s => s.status === 'MISSED')?._count?.status || 0;
        const skippedDoses = stats.find(s => s.status === 'SKIPPED')?._count?.status || 0;
        const adherenceRate = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;
        res.json({
            period: `${days} days`,
            totalDoses,
            takenDoses,
            missedDoses,
            skippedDoses,
            adherenceRate: Math.round(adherenceRate * 100) / 100
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
//# sourceMappingURL=doseController.js.map