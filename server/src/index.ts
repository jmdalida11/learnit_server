import express from "express";
import type { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("I love Kathleen! <3");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
