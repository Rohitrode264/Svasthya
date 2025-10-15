import type { Request, Response } from "express";
export declare const getMedicationReminders: (req: Request, res: Response) => Promise<void>;
export declare const getUserUpcomingReminders: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markReminderSent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sendReminderNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generateAllReminders: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=reminderController.d.ts.map