import express, { Application, Response } from "express";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";

import connect from "./database/db";
import router from "./routes/index";
import authRouter from "./routes/auth";
import Logger from "./configs/winston";

import { userRegDeadline } from "./middleware/deadline";
import { SuccessResponse } from "./core/ApiResponse";

dotenv.config();

require("./controllers/auth/google.auth");
require("./middleware/auth");

process.on("uncaughtException", (error) => {
  // console.log(e);
  Logger.error("Error:>>", error);
});

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
const userAuthMiddleware = passport.authenticate("userStrategy", {
  session: false,
});

connect();

app.get("/", (_, res: Response) => {
  // console.log("Hello Palette");
  new SuccessResponse(
    "Okay Clever person! It's a design hack go hack the designs. Stop viewing our API",
    true
  ).send(res);
});

app.use("/v1", userAuthMiddleware, router);
app.use("/auth", userRegDeadline, authRouter);

export default app;
