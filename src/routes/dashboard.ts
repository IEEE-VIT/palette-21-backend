import { Router } from "express";
import DashboardController from "../controllers/dashboard";

const dashboarRouter = Router();
const dashboard = new DashboardController();

dashboarRouter.get("/findteammates", dashboard.findTeammates);
dashboarRouter.get("/findteams", dashboard.findTeams);
dashboarRouter.get("/needteam", dashboard.needTeam);
dashboarRouter.get("/searchusers", dashboard.searchUsers);
dashboarRouter.get("/searchteams", dashboard.searchTeams);

export default dashboarRouter;
