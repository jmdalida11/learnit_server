import type { Request, Response } from "express";
import { AppDataSource } from "../datasource.js";
import { User } from "../entities/User.js";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  console.log("Fetching user with ID:", req.params["id"]);
  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .select()
    .where("user.id = :id", { id: req.params["id"] })
    .getOne();

  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  res.status(200).json(user);
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, email, name } = req.body;

  if (!username || !password || !email || !name) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  try {
    const newUser = AppDataSource.getRepository(User).create({
      username,
      password,
      email,
      name,
    });

    const savedUser = await AppDataSource.getRepository(User).save(newUser);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user.", error });
  }
};
