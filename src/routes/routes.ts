import { Router } from "express";
import { validate } from "../middleware/middleware";
import { userSchema, postSchema, addressSchema } from "../validators/validators";
import { createUser, getUsers } from "../controllers/userController";
import { createPost, getPosts } from "../controllers/postController";
import { createAddress, getAddresses } from "../controllers/addressController";

const router = Router();

// User Routes
router.post("/users", validate(userSchema), createUser);
router.get("/users", getUsers);

// Post Routes
router.post("/posts", validate(postSchema), createPost);
router.get("/posts", getPosts);

// Address Routes
router.post("/addresses", validate(addressSchema), createAddress);
router.get("/addresses", getAddresses);

export default router;