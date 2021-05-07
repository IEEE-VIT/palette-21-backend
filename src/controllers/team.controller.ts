import { Request, Response } from "express";
import shortid from "shortid";
import { TeamModel } from "../database/models/Team";
import { UserModel } from "../database/models/User";
import {
  ForbiddenResponse,
  InternalErrorResponse,
  NotFoundResponse,
  SuccessResponse,
} from "../core/ApiResponse";

class TeamController {
  fetchTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await TeamModel.find({ users: req.user.id }).populate(
        "users",
        "-email -teamCode"
      );
      res.send(team);
    } catch (error) {
      console.error(error);
    }
  };

  createTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      shortid.characters(
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$"
      );

      const { teamName, needTeam } = req.body;
      const { id } = req.user;
      const userTeamCode = req.user.teamCode;
      let teamCode: string = shortid.generate().toUpperCase().substring(0, 6);
      if (userTeamCode) {
        new ForbiddenResponse("User Already has a team").send(res);
      } else {
        let flag = false;
        const allRecords = await TeamModel.find({}, { teamCode: 1 });
        const sameTeamCode = (newTeamCode: string): boolean =>
          allRecords.some((team) => team.teamCode === newTeamCode);
        while (!flag) {
          if (sameTeamCode(teamCode)) {
            teamCode = shortid.generate().toUpperCase().substring(0, 6);
          } else {
            flag = true;
          }
        }
        await TeamModel.create({
          name: teamName,
          teamCode,
          users: [id],
          invited: [],
          problemStatement: [],
          tries: 0,
        });

        await UserModel.findOneAndUpdate({ _id: id }, { teamCode, needTeam });
        new SuccessResponse("New Team Created", true).send(res);
      }
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error creating a team").send(res);
    }
  };

  leaveTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      shortid.characters(
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$"
      );
      const { id, name } = req.user;
      let teamCode: string = shortid.generate().toUpperCase().substring(0, 6);

      const leftTeam = await TeamModel.findOneAndUpdate(
        { teamCode: req.user.teamCode },
        {
          $pull: { users: id },
        }
      );
      if (!leftTeam) {
        new NotFoundResponse("User is not a part of the team name").send(res);
      }
      const updatedUser = await UserModel.findByIdAndUpdate(id, {
        teamCode: "",
      });
      if (!updatedUser) {
        new NotFoundResponse("User not found to update the team").send(res);
      }
      let flag = false;
      const allRecords = await TeamModel.find({}, { teamCode: 1 });
      const sameTeamCode = (newTeamCode: string): boolean =>
        allRecords.some((team) => team.teamCode === newTeamCode);
      while (!flag) {
        if (sameTeamCode(teamCode)) {
          teamCode = shortid.generate().toUpperCase().substring(0, 6);
        } else {
          flag = true;
        }
      }
      const userName = name.split(" ")[0];
      const newTeamName = `${userName}'s Team`;

      await TeamModel.create({
        name: newTeamName,
        teamCode,
        users: [id],
        invited: [],
        problemStatement: [],
        tries: 0,
      });
      await UserModel.findOneAndUpdate({ _id: id }, { teamCode, newTeamName });
      new SuccessResponse("Team left successfully", true).send(res);
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error leaving the team").send(res);
    }
  };
}

export default TeamController;
