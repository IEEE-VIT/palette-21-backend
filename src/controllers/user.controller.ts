import { Request, Response } from "express";
import Logger from "../configs/winston";
import {
  InternalErrorResponse,
  NotFoundResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import User, { UserModel } from "../database/models/User";

class UserController {
  round0 = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const { discordHandle, skills, tools, outreach } = req.body;
      const firstLogin = true;
      const user: User = await UserModel.findOneAndUpdate(
        { _id: id },
        { discordHandle, skills, tools, outreach, firstLogin },
        { new: true }
      );
      if (!user) {
        new NotFoundResponse("User not found!").send(res);
      }
      new SuccessResponse(
        "User details have been filled successfully!",
        user
      ).send(res);
    } catch (error) {
      // console.log(error);
      Logger.error(` ${req.user.email}:>> Error filling round 0:>> ${error}`);
      new InternalErrorResponse("Error filling up user details!").send(res);
    }
  };

  filledRound0 = async (req: Request, res: Response): Promise<void> => {
    try {
      const { firstLogin, teamCode } = req.user;
      const round0 = firstLogin;
      const teamFormed = !!teamCode;
      new SuccessResponse("Status of user details", {
        round0,
        teamFormed,
      }).send(res);
    } catch (error) {
      // console.log(error);

      Logger.error(
        ` ${req.user.email}:>> Error fetching /filledRound0:>> ${error}`
      );

      new InternalErrorResponse("Unable to fetch filledRound0").send(res);
    }
  };
}

export default UserController;
