import type { Request, Response } from "express";
import { User } from "../entities/User.js";
import { CreateUserDTO } from "../validations/user.js";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const getUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const user = await User.createQueryBuilder("user")
    .select()
    .where("user.id = :id", { id: req.session.user?.id })
    .getOne();

  if (!user) {
    res.status(404).json({ message: "User not found." });
  }

  res.status(200).json({
    id: user?.id,
    username: user?.username,
    email: user?.email,
    name: user?.name,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
  });
};

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const users = await User.find();
  res.status(200).json(users);
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, email, name } = req.body as CreateUserDTO;

  try {
    const existingUser = await User.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      res.status(400).json({ message: "Username or email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(salt + password, 10);

    const newUser = User.create({
      username,
      password: hashedPassword,
      salt,
      email,
      name,
    });

    const savedUser = await User.save(newUser);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Error on creating a user" });
  }
};
