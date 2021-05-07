import { Router } from "express";
import InviteController from "../controllers/invite.controller";

const inviteController = new InviteController();

const inviteRouter = Router();

inviteRouter.get("/sent", inviteController.sentInvites);
inviteRouter.get("/received", inviteController.receivedInvites);
inviteRouter.post("/send", inviteController.sendInvite);
inviteRouter.post("/accept", inviteController.acceptInvite);
inviteRouter.post("/joinbyCode", inviteController.joinTeamByCode);
inviteRouter.post("/reject", inviteController.rejectInvite);
inviteRouter.get("/cancel", inviteController.cancelInvite);

export default inviteRouter;
