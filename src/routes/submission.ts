import { Router } from "express";
import Submission from "../controllers/submission.controller";
import schemas from "../middleware/schema";
import { bodyValidator } from "../middleware/validation";

const submission = new Submission();

const submissionRouter = Router();

submissionRouter.post(
  "/create",
  bodyValidator(schemas.createOrEditSubmission),
  submission.createOrEditSubmission
);
submissionRouter.get("/my", submission.getSubmission);
submissionRouter.get("/roundDetail", submission.getCurrentRoundAndDeadline);

export default submissionRouter;
