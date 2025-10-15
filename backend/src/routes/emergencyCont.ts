import { Router, type Request, type Response } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createEmergencyContact, deleteEmergencyContact, getEmergencyContacts, sosSender } from "../controllers/emergencyContactController.js";
const router=Router();

router.use(authMiddleware);
router.post('/',async (req:Request,res:Response)=>{
    await createEmergencyContact(req,res);
})  

router.delete('/:emergencyContactId',async(req:Request,res:Response)=>{
    await deleteEmergencyContact(req,res);
})

router.post('/send',async(req:Request,res:Response)=>{
    await sosSender(req,res);
})

router.get('/:userId', async(req:Request,res:Response)=>{
    await getEmergencyContacts(req,res);
})
export default router;