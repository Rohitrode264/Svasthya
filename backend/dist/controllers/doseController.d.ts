import type { Request, Response } from "express";
export declare const logDose: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMedicationDoseLogs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserDoseLogs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDoseStatistics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=doseController.d.ts.map