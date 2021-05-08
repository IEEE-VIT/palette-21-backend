import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Logger from "../configs/winston";

dotenv.config();
const { env } = process;

let database: mongoose.Connection;

const dbURI = `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@cluster0.hgmsb.mongodb.net/${env.DB_NAME}?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    // console.log(
    //   "Mongoose default connection disconnected through app termination"
    // );
    Logger.info(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

const connect = (): void => {
  const uri: string = dbURI;

  if (database) {
    return;
  }

  mongoose.connect(uri, options);

  database = mongoose.connection;

  database.once("open", async () => {
    // console.log(`Mongoose default connection opened`);
    Logger.info("Mongoose default connection open");
  });

  database.on("error", () => {
    // console.log("Error connecting to database");
    Logger.error("Error connecting to DB");
  });
};

export const disconnect = (): void => {
  if (!database) {
    return;
  }
  Logger.info(
    "Mongoose default connection disconnected through app termination"
  );
  // console.log(
  //   "Mongoose default connection disconnected through app termination"
  // );
  mongoose.disconnect();
};

export default connect;
