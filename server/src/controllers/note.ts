import type { Request, Response } from "express";
import { Note } from "../entities/Note.js";
import { CreateNoteDTO, UpdateNoteDTO } from "../validations/note.js";
import { User } from "../entities/User.js";

export const createNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, title } = req.body as CreateNoteDTO;

    const user = await User.createQueryBuilder("user")
      .select()
      .where("user.id = :id", { id: userId })
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
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params["userId"];

  try {
    const notes = await Note.createQueryBuilder("note")
      .where("note.userId = :userId", { userId })
      .getMany();

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving notes for the user." });
  }
};

export const getNote = async (req: Request, res: Response): Promise<void> => {
  const note = await Note.createQueryBuilder("note")
    .select()
    .where("note.id = :id", { id: req.params["id"] })
    .getOne();

  if (!note) {
    res.status(404).json({ message: "Note not found." });
    return;
  }

  res.status(200).json(note);
};

export const updateNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { title, content, tags, isShared } = req.body as UpdateNoteDTO;

  try {
    const id = req.params["id"] || "";

    const note = await Note.findOne({
      where: { id },
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
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const note = await Note.findOne({
      where: { id: req.params["id"] || "" },
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
