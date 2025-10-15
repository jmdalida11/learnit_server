import type { Request, Response } from "express";
import { AppDataSource } from "../datasource.js";
import { User } from "../entities/User.js";
import { CreateUserDTO } from "../validations/user.js";

export const getUser = async (req: Request, res: Response): Promise<void> => {
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

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const users = await AppDataSource.getRepository(User).find();
  res.status(200).json(users);
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, email, name } = req.body as CreateUserDTO;

  try {
    const existingUser = await AppDataSource.getRepository(User).findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      res.status(400).json({ message: "Username or email already exists." });
    }

    const newUser = AppDataSource.getRepository(User).create({
      username,
      password,
      email,
      name,
    });

    const savedUser = await AppDataSource.getRepository(User).save(newUser);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error on creating a user" });
  }
};
