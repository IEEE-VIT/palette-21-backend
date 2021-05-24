import { Response } from "express";
import { Request } from "multer";
import * as dotenv from "dotenv";
import s3 from "../helpers/AWSHelper";
import Logger from "../configs/winston";
import { BadRequestResponse, SuccessResponse } from "../core/ApiResponse";

dotenv.config();
const { env } = process;

class imageUpload {
  upload = async (req: Request, res: Response): Promise<void> => {
    try {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];

      console.log(req.file);

      const params = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: `${Math.random().toString(36).substring(7)}.${fileType}`,
        ContentType: "image/png",
        Body: req.file.buffer,
      };

      await s3.upload(params, (error, data) => {
        if (error) new BadRequestResponse(error.message).send(res);
        else
          new SuccessResponse("Image uploaded", {
            key: data.Key,
            location: data.Location,
          }).send(res);
      });
    } catch (error) {
      Logger.error(error);
      new BadRequestResponse(error.message).send(res);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const params = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: req.body.key,
      };

      s3.deleteObject(params, (error, data) => {
        if (error) new BadRequestResponse(error.message).send(res);
        else new SuccessResponse("Image deleted", data).send(res);
      });
    } catch (error) {
      Logger.error(error);
      new BadRequestResponse(error.message).send(res);
    }
  };
}

export default imageUpload;
