import express, { Application, Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
import connect from "./database/db";

import router from "./routes/index";
import authRouter from "./routes/auth";

dotenv.config();

require("./controllers/auth/google.auth");
require("./middleware/auth");

process.on("uncaughtException", (e) => {
  console.log(e);
});

const app: Application = express();

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
const userAuthMiddleware = passport.authenticate("userStrategy", {
  session: false,
});

connect();

app.get("/", (req: Request, res: Response) => {
  console.log("Hello Palette");
  res.send("hello");
});

app.get("/saferoute", userAuthMiddleware, (req: Request, res: Response) => {
  res.send("authorized");
});

app.use("/v1", userAuthMiddleware, router);
app.use("/auth", authRouter);

export default app;
