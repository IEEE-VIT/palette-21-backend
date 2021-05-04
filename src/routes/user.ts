import { Router } from "express";

import passport from "passport";
import UserController from "../controllers/user.controller";

const userRouter = Router();
const userController = new UserController();

// google auth

userRouter.get("/notgoogle", (req, res) => {
  res.send("not ok google");
});

userRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/notgoogle" }),
  userController.googleAuthController
);

// figma auth routes

userRouter.post("/auth/figma", userController.figmaAuthController);

export default userRouter;
