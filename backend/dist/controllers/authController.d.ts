import type { Request, Response } from "express";
export declare const initiateSignup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifySignup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const me: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const initiatePasswordReset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const completePasswordReset: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=authController.d.ts.map