import { Request, Response } from "express";
import moment from "moment-timezone";
import Logger from "../configs/winston";
import { BadRequestResponse, SuccessResponse } from "../core/ApiResponse";
import { DeadlineModel } from "../database/models/Deadline";
import { submsissionModel } from "../database/models/Submission";
import Team, { TeamModel } from "../database/models/Team";

moment.tz.setDefault("Asia/Calcutta");

class submission {
  createOrEditSubmission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { teamCode } = req.user;
      const { title, description, tracks, submissionLink, images } = req.body;
      const userTeam: Team = await TeamModel.findOne(
        { teamCode },
        "problemStatement name"
      );

      const submissionAlreadyExists = await submsissionModel.findOne({
        team: userTeam.id,
      });
      let updatedSubmission;
      if (submissionAlreadyExists) {
        updatedSubmission = await submsissionModel.findOneAndUpdate(
          { team: userTeam.id },
          {
            title,
            description,
            tracks,
            submissionLink,
            images,
          },
          { new: true }
        );
      } else {
        updatedSubmission = await submsissionModel.create({
          team: userTeam.id,
          title,
          description,
          tracks,
          submissionLink,
          images,
        });
      }
      new SuccessResponse(
        "Submission has been updated",
        updatedSubmission
      ).send(res);
    } catch (error) {
      Logger.error(
        `${req.user.email}:>> Error updating/creating submission:>> ${error}`
      );
      new BadRequestResponse(error.message).send(res);
    }
  };

  getSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamCode } = req.user;
      const userTeam: Team = await TeamModel.findOne(
        { teamCode },
        "problemStatement name"
      );

      const submissionAlreadyExists = await submsissionModel.findOne({
        team: userTeam.id,
      });
      if (submissionAlreadyExists) {
        new SuccessResponse(
          "Submission has been sent",
          submissionAlreadyExists
        ).send(res);
      } else {
        throw new Error("Create a Submission first");
      }
    } catch (error) {
      Logger.error(
        `${req.user.email}:>> Error getting user's submission:>> ${error}`
      );
      new BadRequestResponse(error.message).send(res);
    }
  };

  getCurrentRoundAndDeadline = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const currentDateAndTime: Date = new Date();
      const round1Deadline = await DeadlineModel.findOne({ event: "round1" });
      const round2Deadline = await DeadlineModel.findOne({ event: "round2" });
      const round3Deadline = await DeadlineModel.findOne({ event: "round3" });
      let roundNo: number;
      let deadline: Date;
      if (
        round3Deadline.time > currentDateAndTime &&
        currentDateAndTime > round2Deadline.time
      ) {
        roundNo = 3;
        deadline = round3Deadline.time;
      } else if (
        round2Deadline.time > currentDateAndTime &&
        currentDateAndTime > round1Deadline.time
      ) {
        roundNo = 2;
        deadline = round2Deadline.time;
      } else if (round1Deadline.time > currentDateAndTime) {
        roundNo = 1;
        deadline = round1Deadline.time;
      }
      new SuccessResponse(
        "Deadline and Round No on submission portal have been sent",
        {
          roundNo,
          deadline,
        }
      ).send(res);
    } catch (error) {
      Logger.error(
        `${req.user.email}:>> Error showing deadline on submission:>> ${error}`
      );
      new BadRequestResponse(error.message).send(res);
    }
  };
}

export default submission;
