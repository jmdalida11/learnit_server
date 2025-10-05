import express from "express";
import sampleRouter from "./routes/sample.js";
import 'dotenv/config';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use('/sample', sampleRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});