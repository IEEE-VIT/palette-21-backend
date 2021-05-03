import { Request, Response } from "express";
import { TeamModel } from "../database/models/Team";

export const allTeams = (req: Request, res: Response) => {
  const teams = TeamModel.find((err: any, teams: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(teams);
    }
  });
};

export const fetchTeam = (req: Request, res: Response) => {
  const team = TeamModel.find(
    { teamCode: req.params.code },
    (err: any, team: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(team);
      }
    }
  ).populate("users").exec;
};

export const addTeam = (req: Request, res: Response) => {
  const team = new TeamModel(req.body);
  team.teamCode = Math.floor(Math.random() * 1000000 + 1).toString();
  team.save((err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Team added");
    }
  });
};

export const updateTeam = (req: Request, res: Response) => {
  const team = TeamModel.findByIdAndUpdate(
    { teamCode: req.params.code },
    req.body,
    (err: any, team: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(team);
      }
    }
  );
};

export const deleteTeam = (req: Request, res: Response) => {
  const team = TeamModel.deleteOne(
    { teamCode: req.params.code },
    (err: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Team Deleted");
      }
    }
  );
};
