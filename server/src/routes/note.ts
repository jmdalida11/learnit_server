import { Router } from "express";
import { createNote } from "../controllers/note.js";
import { validateBody } from "../middleware/validate.js";
import { createNoteSchema } from "../validations/note.js";

const router = Router();

router.post("/", validateBody(createNoteSchema), createNote);

export default router;
