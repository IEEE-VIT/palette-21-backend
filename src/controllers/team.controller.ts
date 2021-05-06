import { Request, Response } from "express";
import shortid from "shortid";
import { TeamModel } from "../database/models/Team";
import { UserModel } from "../database/models/User";
import { InternalErrorResponse, SuccessResponse } from "../core/ApiResponse";

class TeamController {
  allTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const teams = await TeamModel.find();
      res.send(teams);
    } catch (error) {
      console.error(error);
    }
  };

  fetchTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await TeamModel.findOne({ teamCode: req.params.code });
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
        throw new Error("User Already has a team");
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
      await TeamModel.findOneAndUpdate(
        { teamCode: req.user.teamCode },
        {
          $pull: { users: req.user.id },
        }
      ).then(async () => {
        await UserModel.findByIdAndUpdate(req.user.id, {
          teamCode: "",
        });
      });

      res.send("Left team");
    } catch (error) {
      console.log(error);
    }
  };

  updateTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await TeamModel.findOneAndUpdate(
        { teamCode: req.params.code },
        req.body
      );
      res.send(team);
    } catch (error) {
      console.log(error);
    }
  };

  deleteTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      await TeamModel.deleteOne({ teamCode: req.params.code });
      res.send("Team deleted");
    } catch (error) {
      console.error(error);
    }
  };
}

export default TeamController;
