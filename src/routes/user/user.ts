import { Router } from "express";

import passport from "passport";
import UserController from "../../controllers/user.controller";
// import figmaAuthController from "../../controllers/user.controller";

const userRouter = Router();
const userController = new UserController();

// google auth
userRouter.get("/okgoogle", (req, res) => {
  res.send("ok google");
});

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
  (req, res) => {
    res.redirect("/user/okgoogle");
  }
);

// figma auth

userRouter.post("/auth/figma", userController.figmaAuthController);

export default userRouter;
