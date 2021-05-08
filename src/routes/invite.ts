import { Router } from "express";
import InviteController from "../controllers/invite.controller";
import schemas from "../middleware/schema";
import { bodyValidator } from "../middleware/validation";

const inviteController = new InviteController();

const inviteRouter = Router();

inviteRouter.get("/sent", inviteController.sentInvites);
inviteRouter.get("/received", inviteController.receivedInvites);
inviteRouter.post(
  "/send",
  bodyValidator(schemas.sendInvite),
  inviteController.sendInvite
);
inviteRouter.post(
  "/accept",
  bodyValidator(schemas.acceptInvite),
  inviteController.acceptInvite
);
inviteRouter.post(
  "/joinbyCode",
  bodyValidator(schemas.joinTeamByCode),
  inviteController.joinTeamByCode
);
inviteRouter.post(
  "/cancel",
  bodyValidator(schemas.cancelInvite),
  inviteController.cancelInvite
);
inviteRouter.post(
  "/reject",
  bodyValidator(schemas.rejectInvite),
  inviteController.rejectInvite
);

export default inviteRouter;
