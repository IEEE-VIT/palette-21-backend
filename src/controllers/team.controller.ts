import { Request, Response } from "express";
import { TeamModel } from "../database/models/Team";

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

  addTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await new TeamModel(req.body);
      team.teamCode = Math.floor(Math.random() * 1000000 + 1).toString();
      team.save();
      res.send("Team added");
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