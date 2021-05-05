import { Router } from "express";
import TeamController from "../controllers/team.controller";

const teamRouter = Router();
const teamController = new TeamController();

teamRouter.get("/allTeams", teamController.allTeams);
teamRouter.get("/:code", teamController.fetchTeam);
teamRouter.post("/createTeam", teamController.addTeam);
teamRouter.delete("/deleteTeam/:code", teamController.deleteTeam);
teamRouter.put("/updateTeam/:code", teamController.updateTeam);

export default teamRouter;
