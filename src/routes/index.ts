import { Router } from "express";
import userRouter from "./user";
import teamRouter from "./team";

const router = Router();

router.use("/user", userRouter);
router.use("/team", teamRouter);

export default router;
