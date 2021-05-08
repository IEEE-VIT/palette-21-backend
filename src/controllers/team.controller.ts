import { Request, Response } from "express";
import shortid from "shortid";
import { startSession } from "mongoose";
import { TeamModel } from "../database/models/Team";
import { UserModel } from "../database/models/User";
import {
  ForbiddenResponse,
  InternalErrorResponse,
  SuccessResponse,
} from "../core/ApiResponse";

class TeamController {
  createTeam = async (req: Request, res: Response): Promise<void> => {
    const session = await startSession();
    session.startTransaction();
    try {
      shortid.characters(
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$"
      );

      const { teamName, needTeam } = req.body;
      const { id, firstLogin } = req.user;
      if (!firstLogin) {
        throw new Error("Fill user details first!");
      }
      const userTeamCode: string = req.user.teamCode;
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
        const newTeam = await TeamModel.create(
          [
            {
              name: teamName,
              teamCode,
              users: [id],
              problemStatement: [],
              tries: 0,
            },
          ],
          { session }
        );
        if (!newTeam) {
          throw new Error("Error creating a new team");
        }

        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: id },
          { teamCode, needTeam }
        ).session(session);
        if (!updatedUser) {
          throw new Error("Error updating the user");
        }

        await session.commitTransaction();
        new SuccessResponse("New Team Created", true).send(res);
      }
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      new InternalErrorResponse(error.message).send(res);
    } finally {
      session.endSession();
    }
  };

  leaveTeam = async (req: Request, res: Response): Promise<void> => {
    const session = await startSession();
    session.startTransaction();
    try {
      const oldTeam = await TeamModel.findOne({ teamCode: req.user.teamCode });
      if (!oldTeam) {
        throw new Error("Could not find a team");
      }
      const usersInTeam = oldTeam.users;

      if (Number(usersInTeam.length) === 1) {
        throw new Error("You cannot leave your own team");
      }
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
      ).session(session);
      if (!leftTeam) {
        throw new Error("User is not a part of the team name!");
        // new NotFoundResponse("User is not a part of the team name").send(res);
      }
      const updatedUser = await UserModel.findByIdAndUpdate(id, {
        teamCode: "",
      }).session(session);
      if (!updatedUser) {
        throw new Error("User not found to update the team");
        // new NotFoundResponse("User not found to update the team").send(res);
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

      await TeamModel.create(
        [
          {
            name: newTeamName,
            teamCode,
            users: [id],
            problemStatement: [],
            tries: 0,
          },
        ],
        { session }
      );
      await UserModel.findOneAndUpdate(
        { _id: id },
        { teamCode, newTeamName }
      ).session(session);

      await session.commitTransaction();
      new SuccessResponse("Team left successfully", true).send(res);
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      new InternalErrorResponse(error.message).send(res);
    } finally {
      session.endSession();
    }
  };
}

export default TeamController;
