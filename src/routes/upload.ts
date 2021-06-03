import { Router } from "express";
import os from "os";
import multer from "multer";
import { imageValidator } from "../middleware/validation";
import ImageUpload from "../controllers/upload.controller";

const uploadRouter = Router();
const imageUpload = new ImageUpload();

const storage = multer.memoryStorage({
  destination(req, file, callback) {
    callback(null, os.tmpdir());
  },
  fileFilter: imageValidator,
});

const uploader = multer({ storage }).single("image");

uploadRouter.post("/upload", uploader, imageUpload.upload);
uploadRouter.post("/delete", imageUpload.delete);

export default uploadRouter;
