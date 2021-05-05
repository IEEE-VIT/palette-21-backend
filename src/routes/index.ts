import { Router } from "express";
import teamRouter from "./team";
import inviteRouter from "./invite";
import dashboardouter from "./dashboard";

const router = Router();

router.use("/team", teamRouter);
router.use("/invites", inviteRouter);
router.use("/dashboard", dashboardouter);

export default router;
