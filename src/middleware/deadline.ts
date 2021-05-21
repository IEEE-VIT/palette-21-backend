import { NextFunction, Request, Response } from "express";
import Logger from "../configs/winston";
import { BadRequestResponse } from "../core/ApiResponse";
import { DeadlineModel } from "../database/models/Deadline";

// const userRegDeadline = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const userRegDeadlineTime = (
//       await DeadlineModel.findOne({
//         event: "userReg",
//       })
//     ).time;
//     // Logger.info(userRegDeadlineTime);

//     const deadline = new Date() > userRegDeadlineTime;

//     // Logger.info(deadline);
//     if (!deadline) {
//       next();
//     } else {
//       new BadRequestResponse("Deadline for registeration has passed").send(res);
//     }
//   } catch (e) {
//     Logger.error("Error in userRegDeadline middleware", e);
//   }
// };

const teamRegDeadline = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teamRegDeadlineTime = (
      await DeadlineModel.findOne({
        event: "teamReg",
      })
    ).time;

    // Logger.info(teamRegDeadlineTime);

    const deadline = new Date() > teamRegDeadlineTime;

    if (!deadline) {
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
