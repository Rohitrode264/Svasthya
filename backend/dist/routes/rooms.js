import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createRoom, getRoomPostsBySlug, listRooms } from "../controllers/roomsController.js";
const router = Router();
// GET /api/rooms - list all rooms
router.get("/", listRooms);
// POST /api/rooms - create room (admin only) - simple gate via header/role for now
router.post("/", authMiddleware, async (req, res, next) => {
    // Simple admin gate: if header x-admin === 'true', allow. Replace with real RBAC later.
    const isAdmin = req.headers["x-admin"] === "true";
    if (!isAdmin)
        return res.status(403).json({ error: "Forbidden" });
    return createRoom(req, res);
});
// GET /api/rooms/:slug/posts - posts in a room
router.get(`/:slug/posts`, getRoomPostsBySlug);
export default router;
//# sourceMappingURL=rooms.js.map