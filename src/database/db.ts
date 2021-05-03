import mongoose from 'mongoose';
import * as dotenv from "dotenv";

dotenv.config();
let env = process.env

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

// Create the database connection
mongoose
  .connect(dbURI, options)
  .then(() => {
    console.log('Mongoose connection done');
  })
  .catch((e) => {
    console.log('Mongoose connection error');
    console.log(e);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});