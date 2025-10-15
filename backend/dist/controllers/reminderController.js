import prisma from "../prisma/client.js";
import { sendMail } from "../notifications/emailService.js";
import { DateTime } from "luxon";
export const getMedicationReminders = async (req, res) => {
    try {
        const { medicationId } = req.params;
        const { upcoming } = req.query;
        if (!medicationId) {
            res.status(400).json({ error: "medicationId is required" });
            return;
        }
        const nowUTC = new Date();
        const nowIST = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);
        const roundedNowIST = new Date(nowIST);
        roundedNowIST.setSeconds(0, 0);
        const minuteStart = new Date(roundedNowIST);
        const minuteEnd = new Date(roundedNowIST);
        minuteEnd.setMinutes(minuteEnd.getMinutes() + 1);
        let whereClause = {
            medicationId,
            scheduledAt: { gte: minuteStart, lt: minuteEnd },
        };
        if (upcoming === "true") {
            const tomorrowIST = new Date(nowIST.getTime() + 24 * 60 * 60 * 1000);
            whereClause.scheduledAt = {
                gte: nowIST,
                lte: tomorrowIST,
            };
        }
        const reminders = await prisma.reminder.findMany({ where: whereClause });
        res.json({ reminders, nowIST, minuteStart, minuteEnd });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getUserUpcomingReminders = async (req, res) => {
    try {
        const { userId } = req.params;
        const { hours = 24 } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }
        const now = new Date();
        const futureTime = new Date(now.getTime() + Number(hours) * 60 * 60 * 1000);
        const reminders = await prisma.reminder.findMany({
            where: {
                sent: false,
                scheduledAt: { gte: now, lte: futureTime },
                medication: { userId },
            },
            include: {
                medication: {
                    select: { name: true, brand: true, strength: true, instructions: true },
                },
            },
            orderBy: { scheduledAt: "asc" },
        });
        res.json(reminders);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const markReminderSent = async (req, res) => {
    try {
        const { reminderId } = req.params;
        if (!reminderId) {
            return res.status(400).json({ error: "reminderId is required" });
        }
        const reminder = await prisma.reminder.update({
            where: { id: reminderId },
            data: { sent: true },
            include: {
                medication: {
                    include: { user: { select: { email: true, name: true } } },
                },
            },
        });
        res.json(reminder);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const sendReminderNotification = async (req, res) => {
    try {
        const { reminderId } = req.params;
        if (!reminderId) {
            return res.status(400).json({ error: "reminderId is required" });
        }
        const reminder = await prisma.reminder.findUnique({
            where: { id: reminderId },
            include: {
                medication: {
                    include: { user: { select: { email: true, name: true } } },
                },
            },
        });
        if (!reminder) {
            return res.status(404).json({ error: "Reminder not found" });
        }
        if (reminder.sent) {
            return res.status(400).json({ error: "Reminder already sent" });
        }
        const user = reminder.medication.user;
        if (user?.email) {
            const emailBody = `
        <h2>Medication Reminder</h2>
        <p>Hello ${user.name ?? "User"},</p>
        <p>It's time to take your medication:</p>
        <ul>
          <li><strong>Medication:</strong> ${reminder.medication.name}</li>
          ${reminder.medication.brand ? `<li><strong>Brand:</strong> ${reminder.medication.brand}</li>` : ""}
          ${reminder.medication.strength ? `<li><strong>Strength:</strong> ${reminder.medication.strength}</li>` : ""}
          ${reminder.medication.instructions ? `<li><strong>Instructions:</strong> ${reminder.medication.instructions}</li>` : ""}
        </ul>
        <p>Scheduled for: ${DateTime.fromJSDate(reminder.scheduledAt).toFormat("dd LLL yyyy, HH:mm")}</p>
      `;
            await sendMail(user.email, `Medication Reminder: ${reminder.medication.name}`, emailBody, "MediMinder");
        }
        const updatedReminder = await prisma.reminder.update({
            where: { id: reminderId },
            data: { sent: true },
        });
        res.json({
            message: "Reminder notification sent successfully",
            reminder: updatedReminder,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const generateAllReminders = async (req, res) => {
    try {
        const { days = 7 } = req.body;
        const schedules = await prisma.medSchedule.findMany({
            include: { medication: { select: { id: true, name: true } } },
        });
        let totalRemindersCreated = 0;
        for (const schedule of schedules) {
            await prisma.reminder.deleteMany({
                where: { medicationId: schedule.medicationId, sent: false },
            });
            const reminders = [];
            const now = new Date();
            for (let i = 0; i < days; i++) {
                const reminderDate = new Date(now);
                reminderDate.setDate(now.getDate() + i);
                const [hours, minutes] = schedule.timeOfDay.split(":").map(Number);
                reminderDate.setHours(hours || 0, minutes || 0, 0, 0);
                if (reminderDate > now) {
                    reminders.push({
                        medicationId: schedule.medicationId,
                        scheduledAt: reminderDate,
                        sent: false,
                    });
                }
            }
            if (reminders.length > 0) {
                await prisma.reminder.createMany({ data: reminders });
                totalRemindersCreated += reminders.length;
            }
        }
        res.json({
            message: `Generated ${totalRemindersCreated} reminders for ${schedules.length} schedules`,
            schedulesProcessed: schedules.length,
            remindersCreated: totalRemindersCreated,
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
//# sourceMappingURL=reminderController.js.map