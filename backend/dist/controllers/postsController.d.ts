import type { Request, Response } from "express";
export declare function createPost(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getPostById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getPosts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function addComment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function upvotePost(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createPostNoAuth(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=postsController.d.ts.map