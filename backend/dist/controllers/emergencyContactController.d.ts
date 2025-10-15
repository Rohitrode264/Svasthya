import type { Request, Response } from "express";
export declare const createEmergencyContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEmergencyContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sosSender: (req: Request, res: Response) => Promise<void>;
export declare const getEmergencyContacts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=emergencyContactController.d.ts.map