import { Request, Response } from "express";
import { userModel } from "../database/models/User";

class UserController {
  round0 = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const { discordHandle, skills, tools, outreach } = req.body;
      console.log(id);
      console.log(req.body);
      console.log(discordHandle);
      const usertemp = await userModel.findOneAndUpdate(
        { _id: id },
        { discordHandle, skills, tools, outreach }
      );
      console.log("ye wala dekhmna hai", usertemp);
      res.status(200).send("gg");
    } catch (error) {
      res.send("error making round 0 form");
      console.log("error making round 0 form:>>", error);
    }
  };
}

export default UserController;
