import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getMedicationReminders,
    getUserUpcomingReminders,
    markReminderSent,
    sendReminderNotification,
    generateAllReminders
} from "../controllers/reminderController.js";

const router = Router();

router.use(authMiddleware);

router.get("/medication/:medicationId", getMedicationReminders);

router.get("/user/:userId/upcoming", getUserUpcomingReminders);

router.put("/:reminderId/sent", markReminderSent);

router.post("/:reminderId/send", sendReminderNotification);

router.post("/generate", generateAllReminders);

export default router;
