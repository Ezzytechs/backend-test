import { Router } from "express";
import { validate } from "../middleware/middleware";
import addressSchema from "../validators/addressValidator";
import { createAddress, getAddressByUserId, updateAddress} from "../controllers/addressController";

const router = Router();


// Address Routes
router.post("/:user_id", validate(addressSchema), createAddress);
router.get("/:user_id", getAddressByUserId);
router.patch("/:user_id", updateAddress);

export default router;