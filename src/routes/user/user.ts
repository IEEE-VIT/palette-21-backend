import { Router } from "express";

// import schemas from "../middleware/schemas";
// import validator from "../middleware/validation";

const userRouter = Router();

userRouter.get("/loginWGoogle", () => {
  console.log("google");
});

export default userRouter;
