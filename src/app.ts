import express, { Application, Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
import connect from "./database/db";

import userRouter from "./routes/index";

dotenv.config();

require("./controllers/auth/google.auth");

process.on("uncaughtException", (e) => {
  console.log(e);
});

const app: Application = express();

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

connect();

app.get("/", (req: Request, res: Response) => {
  console.log("Hello Palette");
  res.send("hello");
});

app.use("/user", userRouter);

export default app;
