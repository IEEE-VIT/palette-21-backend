import { Router } from "express";
import UserController from "../controllers/user.controller";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/round0", userController.round0);
userRouter.get("/filledRound0", userController.filledRound0);

export default userRouter;
