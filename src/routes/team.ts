import { Router } from "express";
import {
  allTeams,
  fetchTeam,
  addTeam,
  deleteTeam,
  updateTeam,
} from "../controllers/team.controller";

const teamRouter = Router();
teamRouter.get("/allTeams", allTeams);
teamRouter.get("/team/:code", fetchTeam);
teamRouter.post("/createTeam", addTeam);
teamRouter.delete("/deleteTeam/:code", deleteTeam);
teamRouter.put("/updateTeam/:code", updateTeam);

export default teamRouter;
