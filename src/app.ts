import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
import userRouter from "./routes/index";

dotenv.config();

require("./auth/google.auth");

process.on("uncaughtException", (e) => {
  console.log(e);
});

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// app.use(cors({ optionsSuccessStatus: 200 }));
// app.use(morgan("tiny"));

app.get("/", (req: Request, res: Response) => {
  console.log("Hello Palette");
  res.send("hello");
});

app.use("/user", userRouter);

export default app;
