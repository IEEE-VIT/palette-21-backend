import { Router } from "express";
import InviteController from "../controllers/invite.controller";

const inviteController = new InviteController();

const inviteRouter = Router();

inviteRouter.post("/joinbyCode", inviteController.joinTeamByCode);
inviteRouter.post("/send", inviteController.sendInvite);
inviteRouter.post("/rejectInvite", inviteController.rejectInvite);
inviteRouter.get("/myInvites", inviteController.myInvites);
inviteRouter.get("/sent/:teamCode", inviteController.sentInvites);

export default inviteRouter;
