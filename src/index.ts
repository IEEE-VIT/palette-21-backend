import * as dotenv from "dotenv";
import app from "./app";

dotenv.config();

declare module "express" {
  export interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any;
  }
}

const port = process.env.PORT || "8000";

app
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on("error", (e: Error) => console.log(e));
