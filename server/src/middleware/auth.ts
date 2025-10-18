import { Request, Response, NextFunction } from "express";
import { Session } from "express-session";

interface UserSession {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  session: Session & {
    user?: UserSession;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.session.user) return next();
  res.status(401).json({ message: "Unauthorized" });
};
