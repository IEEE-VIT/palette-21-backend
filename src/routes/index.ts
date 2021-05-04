import { Router } from "express";
import userRouter from "./user";
import teamRouter from "./team";
import inviteRouter from "./invite";

const router = Router();

router.use("/user", userRouter);
router.use("/team", teamRouter);
router.use("/invites", inviteRouter);

export default router;
