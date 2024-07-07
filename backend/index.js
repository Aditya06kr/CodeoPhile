import express from "express";
import cors from "cors";
import connectDb from "./db/index.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_KEY,
  })
);

try {
  connectDb();
  app.listen(8080, (req, res) => {
    console.log("Listening on port 8080");
  });
} catch (err) {
  console.log("Error in connecting to MongoDB:");
}

app.get("/api/v1", (req, res) => {
  res.json("Hello People");
});

import userRouter from "./routes/UserRoute.js";
app.use("/api/v1/user", userRouter);

import codeforcesRouter from "./routes/CodeforcesRoute.js";
app.use("/api/v1/codeforces",codeforcesRouter);
