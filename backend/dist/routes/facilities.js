import { Router } from "express";
import { facilities } from "../controllers/facilitiesController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();
router.use(authMiddleware);
router.get('/', async (req, res) => {
    await facilities(req, res);
});
export default router;
//# sourceMappingURL=facilities.js.map