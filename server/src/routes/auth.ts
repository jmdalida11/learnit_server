import { Router } from "express";
import { login, logout } from "../controllers/auth.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/csrf-token", (req, res) => {
  try {
    res.status(200).json({ csrfToken: req.csrfToken() });
  } catch {
    res.status(500).json({ message: "Could not get CSRF token" });
  }
});

export default router;
