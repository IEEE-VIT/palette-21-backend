import { Router } from "express";
import {
  myInvites,
  addInvite,
  sentInvites,
} from "../controllers/invite.controller";

const inviteRouter = Router();

inviteRouter.post("/add", addInvite);
inviteRouter.get("/:userID", myInvites);
inviteRouter.get("/sent/:teamCode", sentInvites);

export default inviteRouter;
