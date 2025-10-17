import { Router } from "express";
import { createUser, getAllUsers, getUser } from "../controllers/user.js";
import { createUserSchema } from "../validations/user.js";
import { validateBody } from "../middleware/validate.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/me", isAuthenticated, getUser);
router.post("/", validateBody(createUserSchema), createUser);

export default router;
