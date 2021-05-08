import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller";
import schemas from "../middleware/schema";
import { bodyValidator, paramValidator } from "../middleware/validation";

const dashboardRouter = Router();
const dashboard = new DashboardController();

dashboardRouter.get(
  "/searchusers",
  paramValidator(schemas.searchWithPagination),
  dashboard.searchUsers
);
dashboardRouter.get(
  "/searchteams",
  paramValidator(schemas.searchWithPagination),
  dashboard.searchTeams
);
dashboardRouter.get("/toggleneedteam", dashboard.toggleNeedTeam);
dashboardRouter.post(
  "/editteamname",
  bodyValidator(schemas.editTeamName),
  dashboard.editTeamName
);
dashboardRouter.get("/profile", dashboard.profile);

export default dashboardRouter;
