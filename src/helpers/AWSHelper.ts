import * as dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();
const { env } = process;

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ID,
  secretAccessKey: env.AWS_SECRET,
});

export default s3;
