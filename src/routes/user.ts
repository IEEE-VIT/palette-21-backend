import { Router } from "express";
import UserController from "../controllers/user.controller";
import schemas from "../middleware/schema";
import { bodyValidator } from "../middleware/validation";

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  "/round0",
  bodyValidator(schemas.userDetails),
  userController.round0
);
userRouter.get("/filledRound0", userController.filledRound0);

export default userRouter;
