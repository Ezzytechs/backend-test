import { Router } from "express";
import { validate } from "../middleware/middleware";
import userSchema  from "../validators/userValidator";
import { createUser, getUsers,  getUserById, getTotalUsers, } from "../controllers/userController";


const router = Router();

// User Routes
router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/total/users", getTotalUsers);
router.post("/", validate(userSchema), createUser);


export default router;