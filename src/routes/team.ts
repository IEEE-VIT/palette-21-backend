import { Router } from "express";
import TeamController from "../controllers/team.controller";

const teamRouter = Router();
const teamController = new TeamController();

teamRouter.post("/create", teamController.createTeam);
teamRouter.get("/leave", teamController.leaveTeam);

export default teamRouter;
