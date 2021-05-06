import { Request, Response } from "express";
import { Types } from "mongoose";
import { SuccessResponse, InternalErrorResponse } from "../core/ApiResponse";
import { UserModel } from "../database/models/User";
import generateJwtToken from "../middleware/auth";
import figmaAuth from "./auth/figma.auth";

class AuthController {
  figmaAuthController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, redirectUri } = req.body;
      const user = await figmaAuth(code, redirectUri);
      const { name, imgUrl, email } = user;
      const record = await UserModel.findOne({ email });
      let id: Types.ObjectId;
      if (record) {
        const { _id } = record;
        id = _id;
      } else {
        const userInDB = await UserModel.create({
          email,
          userImg: imgUrl,
          name,
        });
        const { _id } = userInDB;
        id = _id;
      }
      // making jwt
      const token = generateJwtToken({ id });
      new SuccessResponse("JWT Token has been created for Figma", {
        token,
      }).send(res);
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error logging in through Figma").send(res);
    }
  };

  googleAuthController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, imgUrl } = req.user;
      const record = await UserModel.findOne({ email });
      let id: Types.ObjectId;
      if (record) {
        const { _id } = record;
        id = _id;
      } else {
        const userInDB = await UserModel.create({
          email,
          userImg: imgUrl,
          name,
        });
        const { _id } = userInDB;
        id = _id;
      }
      // making jwt
      const token = generateJwtToken({ id });
      new SuccessResponse("JWT Token has been created for Google", {
        token,
      }).send(res);
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error logging in through Google").send(res);
    }
  };
}

export default AuthController;
