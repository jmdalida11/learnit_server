import express from "express";
import userRouter from "./routes/user.js";
import noteRouter from "./routes/note.js";
import "dotenv/config";

const port = process.env["PORT"] || 3000;

const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/note", noteRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
