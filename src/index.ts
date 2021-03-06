/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
import app from "./app";
import Logger from "./configs/winston";

dotenv.config();

declare module "express" {
  export interface Request {
    user?: any;
    query?: any;
  }
}

const port = process.env.PORT || "8000";

app
  .listen(port, () => {
    Logger.info(`Server running on port ${port}`);
  })
  .on("error", (error: Error) =>
    Logger.error("Error starting server:>>", error)
  );
