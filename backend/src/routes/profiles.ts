import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    createUser,
    getUserOverview,
    updateUser,
    deleteUser,
    getUserStats,
    getUserRecentActivity
} from "../controllers/profilesController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createUser);

router.get("/:userId/overview", getUserOverview);

router.put("/:userId", updateUser);

router.delete("/:userId", deleteUser);

router.get("/:userId/stats", getUserStats);

router.get("/:userId/activity", getUserRecentActivity);

export default router;