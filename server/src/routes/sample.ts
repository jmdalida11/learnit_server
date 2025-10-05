import { Router } from "express";
import { getSample } from "../controllers/sample.js";

const router = Router();

router.get("/", getSample);

export default router;