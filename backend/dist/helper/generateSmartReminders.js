import prisma from "../prisma/client.js";
import { DateTime } from "luxon";
// Generate future reminders storing scheduledAt in UTC
export async function generateSmartReminders(medicationId, frequency, times, totalDays) {
    const reminders = [];
    const nowUTC = DateTime.utc();
    for (let day = 0; day < totalDays; day++) {
        for (const freq of frequency) {
            const ist = (times[freq] || "08:00").trim();
            // Convert IST time to UTC HH:mm, then compose a UTC Date for the target day
            const utcHHmm = DateTime.fromFormat(ist, "HH:mm", { zone: "Asia/Kolkata" })
                .toUTC();
            const targetUTC = DateTime.utc(nowUTC.year, nowUTC.month, nowUTC.day, utcHHmm.hour, utcHHmm.minute, 0, 0).plus({ days: day });
            if (targetUTC > nowUTC) {
                reminders.push({
                    medicationId,
                    scheduledAt: targetUTC.toJSDate(),
                    sent: false
                });
            }
        }
    }
    if (reminders.length > 0) {
        await prisma.reminder.createMany({ data: reminders });
    }
}
//# sourceMappingURL=generateSmartReminders.js.map