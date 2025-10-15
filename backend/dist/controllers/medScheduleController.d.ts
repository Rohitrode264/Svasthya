import type { Request, Response } from "express";
export declare const createSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMedicationSchedules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=medScheduleController.d.ts.map