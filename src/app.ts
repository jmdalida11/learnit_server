import express from "express";
import userRouter from "./routes/user.js";
import noteRouter from "./routes/note.js";
import authRouter from "./routes/auth.js";
import quizRouter from "./routes/quiz.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import csurf from "csurf";

import "dotenv/config";
import { AppDataSource, initializeDataSource } from "./datasource.js";
import { Session } from "./entities/Session.js";
import { TypeormStore } from "connect-typeorm";

const port = process.env["PORT"] || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    name: "sessionId",
    secret: process.env["SESSION_SECRET"] || "supersecret123",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true, // prevent JS access
      secure: false, // set true in production (requires HTTPS)
      maxAge: 1000 * 60 * 60, // 1 hour
    },
    store: new TypeormStore({
      cleanupLimit: 2,
      ttl: 3600, // seconds
    }).connect(AppDataSource.getRepository(Session)),
  })
);
app.use(
  cors({
    origin: "*", // your frontend URL
    credentials: true, // allow cookies
  })
);

export function conditionalCsrf(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const csrfProtection = csurf({ cookie: false });
  const csrfExcluded = ["/auth/login"];
  if (csrfExcluded.includes(req.path)) return next();
  return csrfProtection(req, res, next);
}
app.use(conditionalCsrf);

interface CsrfError extends Error {
  code: string;
}
app.use(
  (
    err: CsrfError,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err?.code === "EBADCSRFTOKEN") {
      res.status(403).json({ message: "Invalid CSRF token" });
      return;
    }
    next(err);
  }
);

interface SyntaxErrorWithStatus extends SyntaxError {
  status?: number;
  body?: unknown;
}
app.use(
  (
    err: SyntaxErrorWithStatus,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res.status(400).send({ message: "Invalid JSON payload" });
      return;
    }
    console.error(err);
    res.status(500).send({ message: "Something went wrong!" });
  }
);

app.use("/user", userRouter);
app.use("/note", noteRouter);
app.use("/auth", authRouter);
app.use("/quiz", quizRouter);

initializeDataSource();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
