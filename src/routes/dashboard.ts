import { Router } from "express";
import DashboardController from "../controllers/dashboard";

const dashboardRouter = Router();
const dashboard = new DashboardController();

dashboardRouter.get("/findteammates", dashboard.findTeammates);
dashboardRouter.get("/findteams", dashboard.findTeams);
dashboardRouter.get("/toggleneedteam", dashboard.toggleNeedTeam);
dashboardRouter.get("/searchusers", dashboard.searchUsers);
dashboardRouter.get("/searchteams", dashboard.searchTeams);
dashboardRouter.post("/editteamname", dashboard.editTeamName);

export default dashboardRouter;
