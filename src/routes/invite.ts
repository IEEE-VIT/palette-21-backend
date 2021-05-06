import { Router } from "express";
import InviteController from "../controllers/invite.controller";

const inviteController = new InviteController();

const inviteRouter = Router();

inviteRouter.post("/joinbyCode", inviteController.joinTeamByCode);
inviteRouter.post("/add", inviteController.addInvite);
inviteRouter.get("/:userID", inviteController.myInvites);
inviteRouter.get("/sent/:teamCode", inviteController.sentInvites);
// inviteRouter.post("/join/:teamCode", inviteController.acceptInvite);

export default inviteRouter;
