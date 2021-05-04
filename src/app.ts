import express, { Application, Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
import connect from "./database/db";

import router from "./routes/index";
import userRouter from "./routes/user";
import inviteRouter from "./routes/invite";
import teamRouter from "./routes/team";

dotenv.config();

require("./controllers/auth/google.auth");
require("./middleware/auth");

process.on("uncaughtException", (e) => {
  console.log(e);
});

const app: Application = express();
const port: number = 3000 || process.env.PORT;

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

app.use("/v1", userAuthMiddleware, router);
app.use("/user", userRouter);
app.use("/team", teamRouter);
app.use;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

export default app;
