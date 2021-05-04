import { Router } from "express";
import teamRouter from "./team";
import inviteRouter from "./invite";

const router = Router();

router.use("/team", teamRouter);
router.use("/invites", inviteRouter);

export default router;
