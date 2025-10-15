import prisma from "../prisma/client.js";
import { sendMail } from "../notifications/emailService.js";
import type { Request, Response } from "express";
import { DoseStatus, type Prisma } from "@prisma/client";
import { DateTime } from "luxon";

/**
 * Add New Medication (with schedules) and send confirmation email
 */
export const addMedication = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      name,
      brand,
      strength,
      quantity,
      refillThreshold,
      instructions,
      scheduleTimes
    } = req.body as {
      userId: string;
      name: string;
      brand?: string;
      strength?: string;
      quantity?: number;
      refillThreshold?: number;
      instructions?: string;
      scheduleTimes?: string[];
    };

    if (!userId || !name) {
      return res.status(400).json({ error: "userId and name are required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const schedulesData = Array.isArray(scheduleTimes)
      ? scheduleTimes
          .filter(t => typeof t === "string" && t.trim().length > 0)
          .map(ist => {
            const utc = DateTime.fromFormat(ist.trim(), "HH:mm", { zone: "Asia/Kolkata" })
              .toUTC()
              .toFormat("HH:mm");
            return { timeOfDay: utc };
          })
      : [];

    const data: Prisma.MedicationCreateInput = {
      name,
      user: { connect: { id: userId } },
      ...(brand ? { brand } : {}),
      ...(strength ? { strength } : {}),
      ...(typeof quantity === "number" ? { quantity } : {}),
      ...(typeof refillThreshold === "number" ? { refillThreshold } : {}),
      ...(instructions ? { instructions } : {}),
      ...(schedulesData.length > 0 ? { schedules: { create: schedulesData } } : {})
    };

    const created = await prisma.medication.create({
      data,
      include: { schedules: true }
    });

    if (user.email) {
      const scheduleText =
        created.schedules.length > 0
          ? ` at ${created.schedules.map(s => s.timeOfDay).join(", ")}`
          : "";
      const strengthText = created.strength ? ` ${created.strength}` : "";

      const emailHtml = `
        <h2>Medication Added ✅</h2>
        <p>Hello ${user.name ?? "User"},</p>
        <p>We've added <strong>${created.name}${strengthText}</strong>${scheduleText} to your MediMinder.</p>
        ${created.instructions ? `<p><em>Instructions:</em> ${created.instructions}</p>` : ""}
      `;

      await sendMail(
        user.email,
        `Medication Added - ${created.name}${strengthText}`,
        emailHtml,
        "MediMinder"
      );
    }

    return res.status(201).json(created);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};

/**
 * Log a Dose and handle quantity decrement + refill reminder
 */
export const logDose = async (req: Request, res: Response) => {
  try {
    const { medicationId, userId, status, note } = req.body as {
      medicationId: string;
      userId: string;
      status: string;
      note?: string;
    };

    if (!medicationId || !userId || !status) {
      return res
        .status(400)
        .json({ error: "medicationId, userId, and status are required" });
    }

    const normalizedStatus = String(status).toUpperCase();
    if (
      ![DoseStatus.TAKEN, DoseStatus.MISSED, DoseStatus.SKIPPED].includes(
        normalizedStatus as DoseStatus
      )
    ) {
      return res
        .status(400)
        .json({ error: "status must be TAKEN, MISSED, or SKIPPED" });
    }

    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
      include: { user: true }
    });

    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }

    const log = await prisma.doseLog.create({
      data: {
        medicationId,
        userId,
        status: normalizedStatus as DoseStatus,
        note: note ?? null,
        takenAt: new Date()
      }
    });

    // Handle quantity decrement & refill notification
    if (normalizedStatus === DoseStatus.TAKEN) {
      if (typeof medication.quantity === "number" && medication.quantity > 0) {
        await prisma.medication.update({
          where: { id: medicationId },
          data: { quantity: { decrement: 1 } }
        });

        const updated = await prisma.medication.findUnique({ where: { id: medicationId } });
        const updatedQty = typeof updated?.quantity === "number" ? updated.quantity : null;
        const threshold =
          typeof updated?.refillThreshold === "number" ? updated.refillThreshold : null;

        if (
          updatedQty !== null &&
          threshold !== null &&
          updatedQty <= threshold &&
          medication.user?.email
        ) {
          const strengthText = medication.strength ? ` ${medication.strength}` : "";
          await sendMail(
            medication.user.email,
            `Refill Reminder - ${medication.name}${strengthText}`,
            `You’re running low on <strong>${medication.name}${strengthText}</strong> — only ${updatedQty} left! ⏰`,
            "MediMinder"
          );
        }
      }
    }

    // Mark reminders as sent for this time slot
    await prisma.reminder.updateMany({
      where: { medicationId, sent: false, scheduledAt: { lte: new Date() } },
      data: { sent: true }
    });

    return res.status(201).json(log);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};

/**
 * Get all medications for a given user (with schedules and latest dose log)
 */
export const getMedicationsForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params as { userId: string };
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const medications = await prisma.medication.findMany({
      where: { userId },
      include: {
        schedules: true,
        doseLogs: {
          orderBy: { takenAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json(medications);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
};
