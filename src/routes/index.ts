import { Router } from "express";
import teamRouter from "./team";
import inviteRouter from "./invite";
import dashboardouter from "./dashboard";
import submissionRouter from "./submission";
import userRouter from "./user";
// import problemStatementRouter from "./problemStatement";
import teamRegDeadline from "../middleware/deadline";
import uploadRouter from "./upload";

const router = Router();

router.use("/team", teamRegDeadline, teamRouter);
router.use("/invites", teamRegDeadline, inviteRouter);
router.use("/dashboard", dashboardouter);
router.use("/user", userRouter);
// router.use("/problem", problemStatementRouter);
router.use("/submission", submissionRouter);
router.use("/image", uploadRouter);

export default router;
