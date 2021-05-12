import { Router } from "express";
import passport from "passport";
import AuthController from "../controllers/auth.controller";
import { AuthFailureResponse } from "../core/ApiResponse";

const authRouter = Router();
const authController = new AuthController();

// google auth

authRouter.get("/google/error", (req, res) => {
  new AuthFailureResponse("Unable to sign in using Google").send(res);
});

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/error" }),
  authController.googleAuthController
);

// figma auth

authRouter.post("/figma", authController.figmaAuthController);

export default authRouter;
