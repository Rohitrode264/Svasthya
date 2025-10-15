import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createEmergencyContact, deleteEmergencyContact, getEmergencyContacts, sosSender } from "../controllers/emergencyContactController.js";
const router = Router();
router.use(authMiddleware);
router.post('/', async (req, res) => {
    await createEmergencyContact(req, res);
});
router.delete('/:emergencyContactId', async (req, res) => {
    await deleteEmergencyContact(req, res);
});
router.post('/send', async (req, res) => {
    await sosSender(req, res);
});
router.get('/:userId', async (req, res) => {
    await getEmergencyContacts(req, res);
});
export default router;
//# sourceMappingURL=emergencyCont.js.map