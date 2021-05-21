import { Router } from "express";
import teamRouter from "./team";
import inviteRouter from "./invite";
import dashboardouter from "./dashboard";
import userRouter from "./user";
import problemStatementRouter from "./problemStatement";
import submissionRouter from "./submission";
import teamRegDeadline from "../middleware/deadline";

const router = Router();

router.use("/team", teamRegDeadline, teamRouter);
router.use("/invites", teamRegDeadline, inviteRouter);
router.use("/dashboard", dashboardouter);
router.use("/user", userRouter);
router.use("/problem", problemStatementRouter);
router.use("/submission", submissionRouter);
export default router;
