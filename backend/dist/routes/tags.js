import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { listTags, createTag, verifyTag, deleteTag, getTagById } from "../controllers/tagsController.js";
const router = Router();
router.get("/", listTags);
router.post("/", authMiddleware, createTag);
router.get("/:id", getTagById);
router.patch("/:id/verify", authMiddleware, async (req, res, next) => {
    const isAdmin = req.headers["x-admin"] === "true";
    if (!isAdmin)
        return res.status(403).json({ error: "Forbidden" });
    return verifyTag(req, res);
});
router.delete("/:id", authMiddleware, async (req, res, next) => {
    const isAdmin = req.headers["x-admin"] === "true";
    if (!isAdmin)
        return res.status(403).json({ error: "Forbidden" });
    return deleteTag(req, res);
});
export default router;
//# sourceMappingURL=tags.js.map