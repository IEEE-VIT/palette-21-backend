import { Request, Response } from "express";
import { Types } from "mongoose";
import Logger from "../configs/winston";
import { SuccessResponse, AuthFailureResponse } from "../core/ApiResponse";
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
      // console.log(error);
      Logger.error(` Error from figma auth controller:>> ${error}`);
      new AuthFailureResponse(
        "Error logging in through Figma! Please try again"
      ).send(res);
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
      // console.log("hello", error);

      Logger.error(`Error from google auth controller:>> ${error}`);
      new AuthFailureResponse(
        "Error logging in through Google! Please try again"
      ).send(res);
    }
  };
}

export default AuthController;
