import { Request, Response } from "express";
import { Types } from "mongoose";
import { userModel } from "../database/models/User";
import generateJwtToken from "../middleware/auth";
import figmaAuth from "./auth/figma.auth";

class AuthController {
  figmaAuthController = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("figmaloginctrl");

      const { code, redirectUri } = req.body;

      const user = await figmaAuth(code, redirectUri);
      const { name, imgUrl, email } = user;

      const record = await userModel.findOne({ email });
      let id: Types.ObjectId;
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
      const token = generateJwtToken({ id });
      res.send({ token });
    } catch (error) {
      res.send("Error connecting to figma");
      console.log("Error in figma auth controller:>>", error);
    }
  };

  googleAuthController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, imgUrl } = req.user;
      const record = await userModel.findOne({ email });
      let id: Types.ObjectId;
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
      const token = generateJwtToken({ id });
      console.log(token);
      res.send({ token });
    } catch (error) {
      res.send("Error in google auth");
      console.log("Error in google auth controller:>>", error);
    }
  };
}

export default AuthController;
