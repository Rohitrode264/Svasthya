import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    createSchedule,
    getMedicationSchedules,
    updateSchedule,
    deleteSchedule
} from "../controllers/medScheduleController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createSchedule);

router.get("/medication/:medicationId", getMedicationSchedules);

router.put("/:scheduleId", updateSchedule);

router.delete("/:scheduleId", deleteSchedule);

export default router;
