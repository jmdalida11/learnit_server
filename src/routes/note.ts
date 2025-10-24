import { Router } from "express";
import {
  createNote,
  deleteNote,
  getAllUserNotes,
  getNote,
  updateNote,
} from "../controllers/note.js";
import { validateBody } from "../middleware/validate.js";
import { createNoteSchema, updateNoteSchema } from "../validations/note.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", getAllUserNotes);
router.get("/:id", getNote);
router.post("/", validateBody(createNoteSchema), createNote);
router.patch("/:id", validateBody(updateNoteSchema), updateNote);
router.delete("/:id", deleteNote);

export default router;
