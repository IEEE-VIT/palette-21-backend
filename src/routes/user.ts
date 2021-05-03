import { Router } from "express";

import passport from "passport";

const userRouter = Router();

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

export default userRouter;
