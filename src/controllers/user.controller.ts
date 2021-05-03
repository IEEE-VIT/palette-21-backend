import { Request, Response } from "express";
import mongoose from "mongoose";
import { userModel } from "../database/models/User";
import figmaAuth from "./auth/figma.auth";

class UserController {
  figmaAuthController = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("figmaloginctrl");
      console.log(req.body);

      const { code, redirectUri } = req.body;

      const user = await figmaAuth(code, redirectUri);
      console.log(user);
      const { name, imgUrl, email } = user;

      const record = await userModel.findOne({ email });
      let id: mongoose.Types.ObjectId;
      if (record) {
        const { _id } = record;
        id = _id;
        console.log("record was found:>>", record);
      } else {
        const userInDB = await userModel.create({
          email,
          userImg: imgUrl,
          name,
        });
        console.log("new record made:>>", userInDB);
        const { _id } = userInDB;
        id = _id;
      }

      // making jwt
      console.log("_id for jwt:>>", id);
      res.send({
        name,
        email,
        imgUrl,
      });
    } catch (error) {
      res.send("Error connecting to figma");
      console.log("Error in figma auth controller:>>", error);
    }
  };

  // googleAuthController = async (req: Request, res: Response) => {
  //   try {
  //     console.log("Google auth ctrl");
  //     await passport.authenticate("google", {
  //       scope: ["profile", "email"],
  //     });
  //     // res.send("hehe");
  //   } catch (error) {
  //     res.send("Error in google auth");
  //     console.log("Error in google auth controller:>>", console);
  //   }
  // };
}

export default UserController;
