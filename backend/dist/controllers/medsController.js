import prisma from "../prisma/client.js";
import { sendMail } from "../notifications/emailService.js";
export const addMedication = async (req, res) => {
    try {
        const { userId, name, brand, strength, quantity, refillThreshold, instructions, } = req.body;
        if (!userId || !name) {
            return res.status(400).json({ error: "UserId and name are required" });
        }
        const medication = await prisma.medication.create({
            data: {
                userId,
                name,
                brand: brand ?? null,
                strength: strength ?? null,
                quantity: typeof quantity === "number" ? quantity : null,
                refillThreshold: typeof refillThreshold === "number" ? refillThreshold : null,
                instructions: instructions ?? null,
            },
        });
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user?.email) {
                await sendMail(user.email, "Medication Added - MediMinder", `Your medication "${name}" has been added.`, "MediMinder");
            }
        }
        res.status(201).json(medication);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getUserMedications = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const medications = await prisma.medication.findMany({
            where: { userId },
            include: {
                schedules: true,
                reminders: {
                    orderBy: { scheduledAt: "asc" },
                },
                doseLogs: {
                    orderBy: { takenAt: "desc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        if (medications.length === 0) {
            return res.status(404).json({ message: "No medications found for this user" });
        }
        res.json(medications);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const deleteMedication = async (req, res) => {
    try {
        const { medicationId } = req.params;
        if (!medicationId) {
            return res.status(400).json({ error: "medicationId is required" });
        }
        const existingMed = await prisma.medication.findUnique({
            where: { id: medicationId },
            include: {
                reminders: true,
                doseLogs: true,
                schedules: true,
            },
        });
        if (!existingMed) {
            return res.status(404).json({ error: "Medication not found" });
        }
        await prisma.reminder.deleteMany({ where: { medicationId } });
        await prisma.doseLog.deleteMany({ where: { medicationId } });
        await prisma.medSchedule.deleteMany({ where: { medicationId } });
        await prisma.medication.delete({
            where: { id: medicationId },
        });
        res.json({
            message: `Medication "${existingMed.name}" deleted successfully`,
            medicationId,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
//# sourceMappingURL=medsController.js.map