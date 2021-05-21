import { Router } from "express";
import ProblemStatement from "../controllers/problemStatement.controller";
import schemas from "../middleware/schema";
import { bodyValidator } from "../middleware/validation";

const problemStatement = new ProblemStatement();

const problemStatementRouter = Router();

problemStatementRouter.get(
  "/generate",
  problemStatement.generateProblemStatement
);

problemStatementRouter.post(
  "/lock",
  bodyValidator(schemas.lockProblemStatement),
  problemStatement.lockProblemStatement
);

export default problemStatementRouter;
