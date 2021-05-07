import { Router } from "express";
import DashboardController from "../controllers/dashboard";

const dashboardRouter = Router();
const dashboard = new DashboardController();

dashboardRouter.get("/searchusers", dashboard.searchUsers);
dashboardRouter.get("/searchteams", dashboard.searchTeams);
dashboardRouter.get("/toggleneedteam", dashboard.toggleNeedTeam);
dashboardRouter.post("/editteamname", dashboard.editTeamName);
dashboardRouter.post("/profile", dashboard.profile);

export default dashboardRouter;
