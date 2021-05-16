import { Router } from "express";
import ProblemStatement from "../controllers/problemStatement.controller";

const problemStatement = new ProblemStatement();

const problemStatementRouter = Router();

problemStatementRouter.get(
  "/generate",
  problemStatement.generateProblemStatement
);

problemStatementRouter.post("/lock", problemStatement.lockProblemStatement);

export default problemStatementRouter;
