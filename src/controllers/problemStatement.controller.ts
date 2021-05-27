import { Request, Response } from "express";
import moment from "moment-timezone";
import Logger from "../configs/winston";
import { BadRequestResponse, SuccessResponse } from "../core/ApiResponse";
import Team, { TeamModel } from "../database/models/Team";
import constants from "../constants";

class ProblemStatement {
  generateProblemStatement = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { teamCode } = req.user;
      const userTeam: Team = await TeamModel.findOne({ teamCode });
      const startTime = moment.tz(process.env.pb_stmt_deadline, "Asia/Kolkata");
      const currentTime = moment().tz("Asia/Kolkata");

      if (currentTime < startTime) {
        throw new Error("Hodl Up! We are still generating Problem Statements!");
      }

      if (!userTeam) {
        throw new Error(
          "Join or create a team first to get a Problem Statement"
        );
      }
      let { tries } = userTeam;
      const { locked } = userTeam;
      if (tries >= 3) {
        throw new Error(
          "You have exceeded the number of random generations! Your problem statement has been locked."
        );
      }
      if (locked[0] === true && locked[1] === true && locked[2] === true) {
        throw new Error("You have already locked your problem statement");
      }
      const newProblemStatement: Array<string> = userTeam.problemStatement;

      for (let index = 0; index < 3; index += 1) {
        const lockedOneByOne: boolean = userTeam.locked[index];
        let generator = userTeam.problemStatement[index];
        if (!lockedOneByOne) {
          while (userTeam.problemStatement[index] === generator) {
            generator =
              constants.problemStatements[index][
                Math.floor(
                  Math.random() * constants.problemStatements[index].length
                )
              ];
          }
          newProblemStatement[index] = generator;
        }
      }
      tries += 1;
      let updatedTeam: Team;
      if (tries === 3) {
        updatedTeam = await TeamModel.findOneAndUpdate(
          {
            teamCode,
          },
          {
            tries,
            problemStatement: newProblemStatement,
            locked: [true, true, true],
          },
          {
            new: true,
          }
        );
      } else {
        updatedTeam = await TeamModel.findOneAndUpdate(
          {
            teamCode,
          },
          {
            tries,
            problemStatement: newProblemStatement,
          },
          {
            new: true,
          }
        );
      }
      new SuccessResponse("New Problem Statement", {
        newProblemStatement: updatedTeam.problemStatement,
        locked: updatedTeam.locked,
        triesUsed: tries,
      }).send(res);
    } catch (error) {
      Logger.error(
        `${req.user.email}:>> Error generating a problem statement:>> ${error}`
      );
      new BadRequestResponse(error.message).send(res);
    }
  };

  lockProblemStatement = async (req: Request, res: Response): Promise<void> => {
    try {
      const { part1, part2, part3 } = req.body;
      const { teamCode } = req.user;

      const userTeam: Team = await TeamModel.findOne({ teamCode });
      if (!userTeam) {
        throw new Error(
          "Join or create a team first to get a Problem Statement"
        );
      }
      if (
        userTeam.problemStatement[0] === null ||
        userTeam.problemStatement[1] === null ||
        userTeam.problemStatement[2] === null
      ) {
        throw new Error("Please select a Problem Statement to lock!");
      }
      const newLocked: Array<boolean> = userTeam.locked;

      if (part1 === true || part1 === false) {
        newLocked[0] = part1;
      }
      if (part2 === true || part2 === false) {
        newLocked[1] = part2;
      }
      if (part3 === true || part3 === false) {
        newLocked[2] = part3;
      }
      const updatedTeam = await TeamModel.findOneAndUpdate(
        {
          teamCode,
        },
        {
          locked: newLocked,
        },
        {
          new: true,
        }
      );
      new SuccessResponse(
        "Chosen parts have been locked!",
        updatedTeam.locked
      ).send(res);
    } catch (error) {
      Logger.error(
        `${req.user.email}:>> Error locking the problem statement:>> ${error}`
      );
      new BadRequestResponse(error.message).send(res);
    }
  };

  getCurrentProblemStatement = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { teamCode } = req.user;
      const userTeam = await TeamModel.findOne(
        { teamCode },
        "problemStatement locked tries"
      );
      if (!userTeam) {
        throw new Error(
          "Join or create a team first to get a Problem Statement"
        );
      }
      const { problemStatement, locked, tries } = userTeam;
      new SuccessResponse(
        "The current Problem statement of the team has been sent",
        {
          problemStatement,
          locked,
          triesUsed: tries,
        }
      ).send(res);
    } catch (error) {
      new BadRequestResponse(error.message).send(res);
    }
  };
}

export default ProblemStatement;
