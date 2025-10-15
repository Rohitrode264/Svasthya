import { sendMail } from "../notifications/emailService.js";
import cron from "node-cron";
import prisma from "../prisma/client.js";
import { DateTime } from "luxon";

cron.schedule(
  "* * * * *",
  async () => {
    try {
      const nowUTC = DateTime.utc();
      const roundedNowUTC = nowUTC.set({ second: 0, millisecond: 0 });

      const minuteStart = roundedNowUTC.toJSDate();
      const minuteEnd = roundedNowUTC.plus({ minutes: 1 }).toJSDate();
      const hhmmUTC = roundedNowUTC.toFormat("HH:mm");

      console.log(
        `🕐 [UTC] Checking schedules for ${hhmmUTC} between ${minuteStart.toISOString()} and ${minuteEnd.toISOString()}`
      );

      const schedules = await prisma.medSchedule.findMany({
        where: { timeOfDay: hhmmUTC },
        include: { medication: { include: { user: true } } },
      });

      for (const schedule of schedules) {
        const existing = await prisma.reminder.findFirst({
          where: {
            medicationId: schedule.medicationId,
            scheduledAt: { gte: minuteStart, lt: minuteEnd },
          },
        });

        if (!existing) {
          await prisma.reminder.create({
            data: {
              medicationId: schedule.medicationId,
              scheduledAt: roundedNowUTC.toJSDate(),
              sent: false,
            },
          });
        }
      }

      const reminders = await prisma.reminder.findMany({
        where: {
          sent: false,
          scheduledAt: { gte: minuteStart, lt: minuteEnd },
        },
        include: {
          medication: {
            include: { user: true },
          },
        },
      });

      console.log(`📋 Found ${reminders.length} reminders to send`);

      for (const reminder of reminders) {
        const { medication } = reminder;
        const user = medication.user;

        if (!user?.email) continue;

        const emailBody = `
          <h2>Medication Reminder</h2>
          <p>Hello ${user.name ?? "User"},</p>
          <p>It's time to take your medication:</p>
          <ul>
            <li><strong>Medication:</strong> ${medication.name}</li>
            ${medication.brand ? `<li><strong>Brand:</strong> ${medication.brand}</li>` : ""}
            ${medication.strength ? `<li><strong>Strength:</strong> ${medication.strength}</li>` : ""}
            ${medication.instructions ? `<li><strong>Instructions:</strong> ${medication.instructions}</li>` : ""}
          </ul>
          <p>Scheduled (UTC): ${DateTime.fromJSDate(reminder.scheduledAt)
            .toUTC()
            .toFormat("dd LLL yyyy, HH:mm")}</p>
        `;

        try {
          await sendMail(
            user.email,
            `Medication Reminder: ${medication.name}`,
            emailBody,
            "MediMinder"
          );

          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { sent: true },
          });

          await prisma.alert.create({
            data: {
              userId: user.id,
              type: "MED_REMINDER",
              message: `Reminder sent for ${medication.name} (UTC ${DateTime.fromJSDate(
                reminder.scheduledAt
              )
                .toUTC()
                .toFormat("HH:mm")})`,
              delivered: true,
            },
          });

          console.log(`✅ Reminder sent for ${medication.name} to ${user.email}`);
        } catch (error) {
          console.error(`❌ Failed to send reminder ${reminder.id}:`, error);
        }
      }
    } catch (err) {
      console.error("❌ Error running reminder cron:", err);
    }
  },
  { timezone: "UTC" }
);

cron.schedule(
  "0 9 * * *",
  async () => {
    try {
      const meds = await prisma.medication.findMany({
        include: { user: true },
      });

      for (const med of meds) {
        const currentQty = typeof med.quantity === "number" ? med.quantity : 0;
        const threshold =
          typeof med.refillThreshold === "number" ? med.refillThreshold : 5;

        if (med.user?.email && currentQty <= threshold) {
          await sendMail(
            med.user.email,
            "Refill Reminder - MediMinder",
            `Your "${med.name}" is running low. Only ${currentQty} left. Please refill soon.`,
            "MediMinder"
          );

          await prisma.alert
            .create({
              data: {
                userId: med.user.id,
                type: "REFILL_REMINDER",
                message: `Refill due for ${med.name} (qty ${currentQty} ≤ threshold ${threshold})`,
                delivered: true,
              },
            })
            .catch(() => {});
        }
      }
    } catch (err) {
      console.error("❌ Error running refill cron:", err);
    }
  },
  { timezone: "UTC" }
);
