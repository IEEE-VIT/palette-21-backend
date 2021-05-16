import { Request, Response } from "express";
import Logger from "../configs/winston";
import { BadRequestResponse, SuccessResponse } from "../core/ApiResponse";
import { TeamModel } from "../database/models/Team";
import constants from "../configs/constants";

class ProblemStatement {
  generateProblemStatement = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { teamCode } = req.user;
      const userTeam = await TeamModel.findOne({ teamCode });
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
        const lockedOneByOne = userTeam.locked[index];
        if (!lockedOneByOne) {
          const generator =
            constants.problemStatements[index][
              Math.floor(
                Math.random() * constants.problemStatements[index].length
              )
            ];
          newProblemStatement[index] = generator;
        }
      }
      tries += 1;
      const updatedTeam = await TeamModel.findOneAndUpdate(
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
      new SuccessResponse(
        "New Problem Statement",
        updatedTeam.problemStatement
      ).send(res);
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

      const userTeam = await TeamModel.findOne({ teamCode });
      if (!userTeam) {
        throw new Error(
          "Join or create a team first to get a Problem Statement"
        );
      }
      const newLocked: Array<boolean> = userTeam.locked;

      if (part1 === true) {
        newLocked[0] = true;
      }
      if (part2 === true) {
        newLocked[1] = true;
      }
      if (part3 === true) {
        newLocked[2] = true;
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
}

export default ProblemStatement;
