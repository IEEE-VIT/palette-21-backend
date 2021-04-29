import express from "express";
import bodyParser from "body-parser";
// import cors from "cors";
// import path from "path";

process.on("uncaughtException", (e) => {
  console.log(e);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json());
// app.use(cors({ optionsSuccessStatus: 200 }));
// app.use(morgan("tiny"));
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  console.log("Hello Palette");
  res.send("hello");
});

// app.use("/user", userRouter);

export default app;
