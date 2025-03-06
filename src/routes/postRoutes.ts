import { Router } from "express";
import { validate } from "../middleware/middleware";
import postSchema from "../validators/postValidator";
import { createPost, getUserPosts, deletePostById } from "../controllers/postController";

const router = Router();


// Post Routes
router.post("/:user_id", validate(postSchema), createPost);
router.get("/:user_id", getUserPosts);
router.delete("/:post_id", deletePostById);



export default router;