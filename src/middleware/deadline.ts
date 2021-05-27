import { NextFunction, Request, Response } from "express";
import moment from "moment-timezone";
import Logger from "../configs/winston";
import { BadRequestResponse } from "../core/ApiResponse";

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
    // const teamRegDeadlineTime = (
    //   await DeadlineModel.findOne({
    //     event: "teamReg",
    //   })
    // ).time;

    // Logger.info(teamRegDeadlineTime);
    const deadline = moment.tz(process.env.team_reg_deadline, "Asia/Kolkata");
    const currentTime = moment().tz("Asia/Kolkata");
    // const deadline = new Date() > teamRegDeadlineTime;

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
