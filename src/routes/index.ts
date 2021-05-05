import { Router } from "express";
import userRouter from "./user/user";
import dashboardouter from "./dashboard";

const router = Router();

router.use("/user", userRouter);
router.use("/dashboard", dashboardouter);
export default router;
