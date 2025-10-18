import { Router } from "express";
import { login, logout } from "../controllers/auth.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/csrf-token", (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

export default router;
