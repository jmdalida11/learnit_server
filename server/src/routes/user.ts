import { Router } from "express";
import { createUser, getAllUsers, getUser } from "../controllers/user.js";
import { createUserSchema } from "../validations/user.js";
import { validateBody } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use((req, res, next) => {
  const openRoutes = [{ path: "/", method: "POST" }];

  const isOpen = openRoutes.some(
    (r) => r.path === req.path && r.method === req.method
  );

  if (isOpen) return next();
  authenticate(req, res, next);
});

router.get("/", getAllUsers);
router.get("/me", getUser);
router.post("/", validateBody(createUserSchema), createUser);

export default router;
