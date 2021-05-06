import { Router } from "express";
import TeamController from "../controllers/team.controller";

const teamRouter = Router();
const teamController = new TeamController();

teamRouter.get("/leave", teamController.leaveTeam);

teamRouter.get("/allTeams", teamController.allTeams);
teamRouter.get("/:code", teamController.fetchTeam);
teamRouter.post("/create", teamController.createTeam);
teamRouter.delete("/delete/:code", teamController.deleteTeam);
teamRouter.put("/update/:code", teamController.updateTeam);

export default teamRouter;
