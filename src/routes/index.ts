import { Router } from "express";
import teamRouter from "./team";
import inviteRouter from "./invite";
import dashboardouter from "./dashboard";
import userRouter from "./user";

const router = Router();

router.use("/team", teamRouter);
router.use("/invites", inviteRouter);
router.use("/dashboard", dashboardouter);
router.use("/user", userRouter);

export default router;
