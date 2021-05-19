import { NextFunction, Request, Response } from "express";
import Logger from "../configs/winston";
import { BadRequestResponse } from "../core/ApiResponse";
// import { DeadlineModel } from "../database/models/Deadline";

const userRegDeadline = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const deadline = false;
    if (deadline) {
      next();
    } else {
      new BadRequestResponse("Deadline for registeration has passed").send(res);
    }
  } catch (e) {
    Logger.error("Error in userRegDeadline middleware", e);
  }
};

const teamRegDeadline = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const deadline = false;
    if (deadline) {
      next();
    } else {
      new BadRequestResponse("Deadline for team formation has passed").send(
        res
      );
    }
  } catch (e) {
    Logger.error("Error in teamRegDeadline middleware", e);
  }
};

export { userRegDeadline, teamRegDeadline };
