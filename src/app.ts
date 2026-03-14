import express, { Express } from "express";
import userRouter from "./routes/user.js";
import noteRouter from "./routes/note.js";
import authRouter from "./routes/auth.js";
import quizRouter from "./routes/quiz.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import csurf from "csurf";

import "dotenv/config";
import { Session } from "./entities/Session.js";
import { TypeormStore } from "connect-typeorm";
import { DataSource } from "typeorm";
import { createDataSourceInstance } from "datasource.js";

const PORT = process.env["PORT"] || 3000;
const CORS_ORIGIN = process.env["CORS"]
  ? process.env["CORS"].split(",").map((origin) => origin.trim())
  : [];

interface CsrfError extends Error {
  code: string;
}

interface SyntaxErrorWithStatus extends SyntaxError {
  status?: number;
  body?: unknown;
}

class LearnitApp {
  private readonly app: Express;
  private readonly dataSource: DataSource;

  constructor(app: Express, dataSource: DataSource) {
    this.app = app;
    this.dataSource = dataSource;
    this.init();
  }

  private init(): void {
    this.initMiddlewares();
    this.initRouters();
  }

  private initMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
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
          sameSite: "lax",
        },
        store: new TypeormStore({
          cleanupLimit: 10,
          ttl: 3600, // seconds
        }).connect(this.dataSource.getRepository(Session)),
      }),
    );
    this.app.use(
      cors({
        origin: CORS_ORIGIN,
        credentials: true, // allow cookies
      }),
    );
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        const csrfProtection = csurf({ cookie: false });
        const csrfExcluded = ["/auth/login", "/user"];
        if (csrfExcluded.includes(req.path)) return next();
        return csrfProtection(req, res, next);
      },
    );
    this.app.use(
      (
        err: CsrfError,
        _req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        if (err?.code === "EBADCSRFTOKEN") {
          res.status(403).json({ message: "Invalid CSRF token" });
          return;
        }
        next(err);
      },
    );
    this.app.use(
      (
        err: SyntaxErrorWithStatus,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
          res.status(400).send({ message: "Invalid JSON payload" });
          return;
        }
        console.error(err);
        res.status(500).send({ message: "Something went wrong!" });
      },
    );
  }

  private initRouters(): void {
    this.app.use("/user", userRouter);
    this.app.use("/note", noteRouter);
    this.app.use("/auth", authRouter);
    this.app.use("/quiz", quizRouter);
  }

  public async initializeDataSource() {
    try {
      await this.dataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (error) {
      console.log(error);
    }
  }

  public run(): void {
    this.app.listen(Number(PORT), "0.0.0.0", (err) => {
      if (err) {
        console.log("Something went wrong. " + err);
      }
      console.log(`Server is running on PORT = ${PORT}`);
    });
  }
}

const main = async () => {
  const app = new LearnitApp(express(), createDataSourceInstance());
  await app.initializeDataSource();
  app.run();
};

main();
