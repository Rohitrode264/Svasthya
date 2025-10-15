import type { Request, Response } from "express";
/**
 * Add New Medication (with schedules) and send confirmation email
 */
export declare const addMedication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Log a Dose and handle quantity decrement + refill reminder
 */
export declare const logDose: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get all medications for a given user (with schedules and latest dose log)
 */
export declare const getMedicationsForUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=medicationController.d.ts.map