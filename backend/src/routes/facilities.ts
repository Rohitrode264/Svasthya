import { Router, type Request, type Response } from "express";
import { facilities } from "../controllers/facilitiesController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router =Router();
router.use(authMiddleware);
router.get('/',async(req:Request,res:Response)=>{
    await facilities(req,res);
})

export default router;