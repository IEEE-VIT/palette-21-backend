import { Router } from "express";
import InviteController from "../controllers/invite.controller";
import schemas from "../middleware/schema";
import { bodyValidator } from "../middleware/validation";
import recaptcha from "../middleware/captcha";

const inviteController = new InviteController();

const inviteRouter = Router();

inviteRouter.get("/sent", inviteController.sentInvites);
inviteRouter.get("/received", inviteController.receivedInvites);
inviteRouter.post(
  "/send",
  recaptcha,
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
  recaptcha,
  bodyValidator(schemas.joinTeamByCode),
  inviteController.joinTeamByCode
);
inviteRouter.post(
  "/cancel",
  recaptcha,
  bodyValidator(schemas.cancelInvite),
  inviteController.cancelInvite
);
inviteRouter.post(
  "/reject",
  bodyValidator(schemas.rejectInvite),
  inviteController.rejectInvite
);

export default inviteRouter;
