import express from "express";
import {
    initiateSignup,
    verifySignup,
    login,
    me,
    initiatePasswordReset,
    completePasswordReset
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", initiateSignup);
router.post("/register/verify", verifySignup);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/password/forgot", initiatePasswordReset);
router.post("/password/reset", completePasswordReset);

export default router;
