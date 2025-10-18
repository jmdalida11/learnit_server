import type { Response } from "express";
import { Note } from "../entities/Note.js";
import { CreateNoteDTO, UpdateNoteDTO } from "../validations/note.js";
import { User } from "../entities/User.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const createNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { title } = req.body as CreateNoteDTO;

    const user = await User.createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id: req.session.user?.id })
      .getOne();

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const newNote = Note.create({
      user,
      title,
    });

    const savedNote = await Note.save(newNote);
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: "Error creating a note" });
  }
};

export const getAllUserNotes = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const notes = await Note.createQueryBuilder("note")
      .where("note.userId = :userId", { userId: req.session.user?.id })
      .getMany();

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving notes for the user." });
  }
};

export const getNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const note = await Note.createQueryBuilder("note")
      .select()
      .where("note.id = :id", { id: req.params["id"] })
      .andWhere("note.userId = :userId", { userId: req.session.user?.id })
      .getOne();

    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    res.status(200).json(note);
  } catch {
    res.status(500).json({ message: "Error retrieving the note." });
  }
};

export const updateNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { title, content, tags, isShared } = req.body as UpdateNoteDTO;

  try {
    const id = req.params["id"] || "";

    const note = await Note.findOne({
      where: { id, user: { id: req.session.user?.id ?? "" } },
    });

    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.tags = tags ?? note.tags;
    note.isShared = isShared ?? note.isShared;

    const updatedNote = await Note.save(note);
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Error updating the note." });
  }
};

export const deleteNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const note = await Note.findOne({
      where: {
        id: req.params["id"] ?? "",
        user: { id: req.session.user?.id ?? "" },
      },
    });

    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    await Note.remove(note);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting the note." });
  }
};
