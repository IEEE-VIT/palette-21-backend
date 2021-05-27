import { Request, Response } from "express";
import moment from "moment-timezone";
import { Types } from "mongoose";
import Logger from "../configs/winston";
import {
  SuccessResponse,
  AuthFailureResponse,
  ForbiddenResponse,
} from "../core/ApiResponse";
import { DeadlineModel } from "../database/models/Deadline";
import User, { UserModel } from "../database/models/User";
import generateJwtToken from "../middleware/auth";
import figmaAuth from "./auth/figma.auth";

class AuthController {
  figmaAuthController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, redirectUri } = req.body;
      const user = await figmaAuth(code, redirectUri);
      const { name, imgUrl, email } = user;
      const record: User = await UserModel.findOne({ email });
      let id: Types.ObjectId;
      if (record) {
        const { _id } = record;
        id = _id;
      } else {
        // const userRegDeadlineTime = (
        //   await DeadlineModel.findOne({
        //     event: "userReg",
        //   })
        // ).time;

        // const deadline = new Date() > userRegDeadlineTime;
        const deadline = moment.tz(
          process.env.user_reg_deadline,
          "Asia/Kolkata"
        );
        const currentTime = moment().tz("Asia/Kolkata");
        // Logger.info(deadline);
        if (currentTime < deadline) {
          // next();
          const userInDB: User = await UserModel.create({
            email,
            userImg: imgUrl,
            name,
          });
          const { _id } = userInDB;
          id = _id;
        } else {
          new ForbiddenResponse("Deadline for registeration has passed").send(
            res
          );
          return;
        }
      }
      // making jwt
      const token: string = generateJwtToken({ id });
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
      const record: User = await UserModel.findOne({ email });
      let id: Types.ObjectId;
      if (record) {
        const { _id } = record;
        id = _id;
      } else {
        const userRegDeadlineTime = (
          await DeadlineModel.findOne({
            event: "userReg",
          })
        ).time;

        const deadline = new Date() > userRegDeadlineTime;

        // Logger.info(deadline);
        if (!deadline) {
          // next();
          const userInDB: User = await UserModel.create({
            email,
            userImg: imgUrl,
            name,
          });
          const { _id } = userInDB;
          id = _id;
        } else {
          res.redirect(
            `${process.env.FRONTEND_URL}successfulAuth?token=passed&deadline=true`
          );
          return;
        }
      }
      // making jwt
      const token: string = generateJwtToken({ id });
      res.cookie("token", token);
      res.redirect(
        `${process.env.FRONTEND_URL}successfulAuth?token=${token}&deadline=false`
      );
      // new SuccessResponse("JWT Token has been created for Google", {
      //   token,
      // }).send(res);
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
