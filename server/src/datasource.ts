import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Note } from "./entities/Note.js";
import { Quiz } from "./entities/Quiz.js";
import { Question } from "./entities/Question.js";
import { StudyPlan } from "./entities/StudyPlan.js";
import { Notification } from "./entities/Notification.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  // host: process.env["DB_HOST"] || "localhost",
  // port: 5432,
  // username: process.env["DB_USER"] || "postgres",
  // password: process.env["DB_PASSWORD"] || "password",
  database: process.env["DB_NAME"] || "learnit.db",
  logging: false,
  entities: [User, Note, Quiz, Question, StudyPlan, Notification],
  synchronize: false,
  migrations: ["src/migrations/*.ts"],
});

export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.log(error);
  }
};
