import { Router } from "express";
import DashboardController from "../controllers/dashboard";

const dashboardouter = Router();
const dashboard = new DashboardController();

dashboardouter.get("/findteammates", dashboard.findTeammates);
dashboardouter.get("/findteams", dashboard.findTeams);
dashboardouter.get("/needteam", dashboard.needTeam);
dashboardouter.get("/searchusers", dashboard.searchUsers);
dashboardouter.get("/searchteams", dashboard.searchTeams);

export default dashboardouter;
