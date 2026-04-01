import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Note } from "./entities/Note.js";
import { Quiz } from "./entities/Quiz.js";
import { Question } from "./entities/Question.js";
import { StudyPlan } from "./entities/StudyPlan.js";
import { Notification } from "./entities/Notification.js";
import { Session } from "./entities/Session.js";
import { Category } from "./entities/Category.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env["DB_NAME"] || "learnit.db",
  logging: false,
  entities: [User, Note, Quiz, Question, StudyPlan, Notification, Session, Category],
  synchronize: false,
  migrations: ["src/migrations/*.ts"],
});
