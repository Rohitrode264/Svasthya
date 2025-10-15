import { Router } from "express";
import { addMedication, deleteMedication, getUserMedications } from "../controllers/medsController.js";
import { logDose, getMedicationDoseLogs, getUserDoseLogs, getDoseStatistics } from "../controllers/doseController.js";
const router = Router();
router.post("/add", addMedication);
router.get("/user/:userId", getUserMedications);
router.delete("/:medicationId", deleteMedication);
router.post("/log", logDose);
router.get("/:medicationId/logs", getMedicationDoseLogs);
router.get("/user/:userId/logs", getUserDoseLogs);
router.get("/user/:userId/stats", getDoseStatistics);
export default router;
//# sourceMappingURL=meds.js.map