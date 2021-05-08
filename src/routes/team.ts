import { Router } from "express";
import TeamController from "../controllers/team.controller";
import schemas from "../middleware/schema";
import { bodyValidator } from "../middleware/validation";

const teamRouter = Router();
const teamController = new TeamController();

teamRouter.post(
  "/create",
  bodyValidator(schemas.createTeam),
  teamController.createTeam
);
teamRouter.get("/leave", teamController.leaveTeam);

export default teamRouter;
