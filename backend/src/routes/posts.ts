import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addComment, createPost, createPostNoAuth, getPostById, getPosts, upvotePost } from "../controllers/postsController.js";

const router = Router();

router.get("/", getPosts);

router.post("/", authMiddleware, createPost);

router.get("/:id", getPostById);

router.post("/:id/comments", authMiddleware, addComment);

router.patch("/:id/upvote", authMiddleware, upvotePost);

router.post('/postMulti',authMiddleware,createPostNoAuth);

export default router;


