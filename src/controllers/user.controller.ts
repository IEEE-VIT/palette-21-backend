import { Request, Response } from "express";
import { InternalErrorResponse, SuccessResponse } from "../core/ApiResponse";
import { UserModel } from "../database/models/User";

class UserController {
  round0 = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const { discordHandle, skills, tools, outreach } = req.body;
      const firstLogin = true;
      await UserModel.findOneAndUpdate(
        { _id: id },
        { discordHandle, skills, tools, outreach, firstLogin }
      );
      new SuccessResponse("Round0 Filled", true).send(res);
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Unable to fill round0").send(res);
    }
  };

  filledRound0 = async (req: Request, res: Response): Promise<void> => {
    try {
      const round0 = req.user.firstLogin;

      const teamFormed = !!req.user.teamCode;

      new SuccessResponse("Round0 form", { round0, teamFormed }).send(res);
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Unable to fetch filledRound0").send(res);
    }
  };
}

export default UserController;