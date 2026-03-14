import type { Request, Response } from "express";
import { User } from "@entities/User.js";
import bcrypt from "bcryptjs";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const valid = await bcrypt.compare(user.salt + password, user.password);
    if (!valid) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    req.session.regenerate(() => {
      (req.session as any).user = { id: user.id };
      req.session.save(() => {
        res.json({ message: "Login successful" });
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    (req.session as any).user = null;
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Logout failed" });
      } else {
        res.clearCookie("sessionId", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });
        res.sendStatus(204);
      }
    });
  } catch {
    res.status(500).json({ message: "Logout failed" });
  }
};
