import { Router } from "express";
import { addMedication, logDose, getMedicationsForUser } from "./medicationController.js";
const router = Router();
router.post("/add", addMedication);
router.post("/log", logDose);
router.get("/:profileId", getMedicationsForUser);
export default router;
//# sourceMappingURL=medicationRoutes.js.map