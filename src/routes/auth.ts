import { Router } from "express";

import passport from "passport";
import AuthController from "../controllers/auth.controller";

const authRouter = Router();
const authController = new AuthController();

// google auth

authRouter.get("/notgoogle", (req, res) => {
  res.send("not ok google");
});

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/notgoogle" }),
  authController.googleAuthController
);

// figma auth

authRouter.post("/figma", authController.figmaAuthController);

export default authRouter;
