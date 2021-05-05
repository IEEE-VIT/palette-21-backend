import { Request, Response } from "express";
import shortid from "shortid";
import { TeamModel } from "../database/models/Team";
import { userModel } from "../database/models/User";

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
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
      );
      const { teamName, needTeam = false } = req.body;
      const { id } = req.user;
      const userTeamCode = req.user.teamCode;
      let teamCode: string = shortid.generate();

      if (userTeamCode) {
        res.send("User Already has a team");
      } else {
        let flag = false;
        console.log(1);
        // const record = TeamModel.find();
        const record = await TeamModel.findOne({
          teamCode,
        });
        console.log(record);
        while (!flag) {
          if (!record) {
            console.log("team code was not found:>>");
            console.log(2);
            flag = true;
          } else {
            teamCode = shortid.generate();
            console.log(3);
          }
        }
        console.log(4);
        const teamInDb = await TeamModel.create({
          teamCode,
          users: [id],
          invited: [],
          name: teamName,
          problemStatement: [],
          tries: 0,
        });

        const usertemp = await userModel.findOneAndUpdate(
          { _id: id },
          { teamCode, needTeam }
        );
        console.log("new record made:>>", teamInDb);
        console.log("USER updated", usertemp);
        res.send("success");
      }
    } catch (error) {
      console.log(error);
      res.send(error);
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
