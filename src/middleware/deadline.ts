import { NextFunction, Request, Response } from "express";
import moment from "moment-timezone";
import Logger from "../configs/winston";
import { BadRequestResponse } from "../core/ApiResponse";

const teamRegDeadline = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deadline = moment.tz(process.env.team_reg_deadline, "Asia/Kolkata");
    const currentTime = moment().tz("Asia/Kolkata");

    if (currentTime < deadline) {
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

export default teamRegDeadline;
