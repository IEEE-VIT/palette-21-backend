import { Router } from "express";
import InviteController from "../controllers/invite.controller";

const inviteController = new InviteController();

const inviteRouter = Router();

inviteRouter.post("/joinbyCode", inviteController.joinTeamByCode);
inviteRouter.post("/send", inviteController.sendInvite);
inviteRouter.post("/rejectInvite", inviteController.rejectInvite);
inviteRouter.get("/myInvites", inviteController.myInvites);
inviteRouter.get("/sentInvites", inviteController.sentInvites);
inviteRouter.get("/cancelInvite", inviteController.cancelInvite);

export default inviteRouter;
