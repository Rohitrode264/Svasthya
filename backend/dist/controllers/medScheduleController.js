import prisma from "../prisma/client.js";
import { sendMail } from "../notifications/emailService.js";
import { generateSmartReminders } from "../helper/generateSmartReminders.js";
import { DateTime } from "luxon";
export const createSchedule = async (req, res) => {
    try {
        const { medicationId, frequency, times, duration, instructions } = req.body;
        const medication = await prisma.medication.findUnique({
            where: { id: medicationId },
            include: {
                user: true
            }
        });
        if (!medication) {
            return res.status(404).json({ error: "Medication not found" });
        }
        let totalDays;
        if (duration.type === "auto") {
            const totalTablets = medication.quantity || 0;
            const dosesPerDay = frequency.length;
            totalDays = Math.ceil(totalTablets / dosesPerDay);
        }
        else {
            totalDays = duration.days || 7;
        }
        const schedules = [];
        for (const freq of frequency) {
            const istTime = (times[freq] || "08:00").trim();
            const utcTime = DateTime.fromFormat(istTime, "HH:mm", { zone: "Asia/Kolkata" })
                .toUTC()
                .toFormat("HH:mm");
            const schedule = await prisma.medSchedule.create({
                data: {
                    medicationId,
                    timeOfDay: utcTime,
                    recurrence: "daily",
                }
            });
            schedules.push(schedule);
        }
        await generateSmartReminders(medicationId, frequency, times, totalDays);
        const totalReminders = totalDays * frequency.length;
        const remainingTablets = Math.max(0, (medication.quantity || 0) - totalReminders);
        const scheduleSummary = frequency
            .map(f => `${f}: ${(times[f] || "08:00").trim()} IST → ${DateTime.fromFormat((times[f] || "08:00").trim(), "HH:mm", { zone: "Asia/Kolkata" }).toUTC().toFormat("HH:mm")} UTC`)
            .join(", ");
        if (medication.user.email) {
            await sendMail(medication.user.email, "Medication Schedule Created - MediMinder", `A schedule for "${medication.name}" has been created: ${scheduleSummary}.`, "MediMinder");
        }
        res.status(201).json({
            schedules,
            duration: {
                totalDays,
                dosesPerDay: frequency.length,
                totalReminders,
                remainingTablets
            },
            message: `Schedule created for ${totalDays} days with ${frequency.length} doses per day`
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const getMedicationSchedules = async (req, res) => {
    try {
        const { medicationId } = req.params;
        if (!medicationId) {
            return res.status(400).json({ error: "medicationId is required" });
        }
        const schedules = await prisma.medSchedule.findMany({
            where: { medicationId },
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
                timeOfDay: 'asc'
            }
        });
        res.json(schedules);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const updateSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const { timeOfDay, recurrence } = req.body;
        if (!scheduleId) {
            return res.status(400).json({ error: "scheduleId is required" });
        }
        if (timeOfDay) {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(timeOfDay)) {
                return res.status(400).json({
                    error: "timeOfDay must be in HH:MM format"
                });
            }
        }
        const existingSchedule = await prisma.medSchedule.findUnique({
            where: { id: scheduleId }
        });
        if (!existingSchedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }
        const nextTimeUTC = timeOfDay
            ? DateTime.fromFormat(timeOfDay.trim(), "HH:mm", { zone: "Asia/Kolkata" }).toUTC().toFormat("HH:mm")
            : undefined;
        const updatedSchedule = await prisma.medSchedule.update({
            where: { id: scheduleId },
            data: {
                timeOfDay: nextTimeUTC || existingSchedule.timeOfDay,
                recurrence: recurrence || existingSchedule.recurrence,
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
        if (timeOfDay && timeOfDay !== existingSchedule.timeOfDay) {
            await regenerateRemindersForSchedule(scheduleId);
        }
        res.json(updatedSchedule);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
export const deleteSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        if (!scheduleId) {
            return res.status(400).json({ error: "scheduleId is required" });
        }
        const existingSchedule = await prisma.medSchedule.findUnique({
            where: { id: scheduleId }
        });
        if (!existingSchedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }
        await prisma.reminder.deleteMany({
            where: {
                medicationId: existingSchedule.medicationId,
                sent: false
            }
        });
        await prisma.medSchedule.delete({
            where: { id: scheduleId }
        });
        res.json({ message: "Schedule deleted successfully" });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ error: message });
    }
};
async function generateRemindersForSchedule(scheduleId, medicationId, timeOfDay) {
    const reminders = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
        const reminderDate = new Date(now);
        reminderDate.setDate(now.getDate() + i);
        const [hours, minutes] = timeOfDay.split(':').map(Number);
        reminderDate.setHours(hours || 24, minutes, 0, 0);
        if (reminderDate > now) {
            reminders.push({
                medicationId,
                scheduledAt: reminderDate,
                sent: false
            });
        }
    }
    if (reminders.length > 0) {
        await prisma.reminder.createMany({
            data: reminders
        });
    }
}
async function regenerateRemindersForSchedule(scheduleId) {
    const schedule = await prisma.medSchedule.findUnique({
        where: { id: scheduleId }
    });
    if (!schedule)
        return;
    await prisma.reminder.deleteMany({
        where: {
            medicationId: schedule.medicationId,
            sent: false
        }
    });
    await generateRemindersForSchedule(scheduleId, schedule.medicationId, schedule.timeOfDay);
}
//# sourceMappingURL=medScheduleController.js.map