import { Router } from "express";

import { authenticate } from "../middleware/auth.js";
import {
  createQuiz,
  deleteQuiz,
  getAllUserQuizzes,
  getQuiz,
  updateQuiz,
} from "../controllers/quiz.js";
import { createQuizSchema, updateQuizSchema } from "../validations/quiz.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

router.get("/", getAllUserQuizzes);
router.get("/:id", getQuiz);
router.post("/", validateBody(createQuizSchema), createQuiz);
router.put("/:id", validateBody(updateQuizSchema), updateQuiz);
router.delete("/:id", deleteQuiz);

export default router;
