import { Router } from "express";
import { createNote, getAllUserNotes, getNote } from "../controllers/note.js";
import { validateBody } from "../middleware/validate.js";
import { createNoteSchema } from "../validations/note.js";

const router = Router();

router.get("/user/:userId", getAllUserNotes);
router.get("/:id", getNote);
router.post("/", validateBody(createNoteSchema), createNote);

export default router;
