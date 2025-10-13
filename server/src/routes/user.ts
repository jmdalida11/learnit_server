import { Router } from "express";
import { createUser, getUser } from "../controllers/user.js";
import { createUserSchema } from "../validations/user.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.get("/:id", getUser);
router.post("/", validateBody(createUserSchema), createUser);

export default router;
