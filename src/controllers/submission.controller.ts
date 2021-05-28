import { Request, Response } from "express";
import moment from "moment-timezone";
import Logger from "../configs/winston";
import { BadRequestResponse, SuccessResponse } from "../core/ApiResponse";
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
      const { title, description, tracks, submissionLink } = req.body;
      const userTeam: Team = await TeamModel.findOne(
        { teamCode },
        "problemStatement name"
      );
      if (!userTeam) {
        throw new Error("Please join or create a team to submit!");
      }
      const submissionAlreadyExists = await submsissionModel.findOne({
        team: userTeam.id,
      });
      let updatedSubmission;

      const currentTime = moment().tz("Asia/Kolkata");
      const round1Deadline = moment.tz(
        process.env.round_1_deadline,
        "Asia/Kolkata"
      );
      const round2Deadline = moment.tz(
        process.env.round_2_deadline,
        "Asia/Kolkata"
      );
      const round3Deadline = moment.tz(
        process.env.round_3_deadline,
        "Asia/Kolkata"
      );
      if (currentTime < round1Deadline) {
        if (submissionAlreadyExists) {
          updatedSubmission = await submsissionModel.findOneAndUpdate(
            { team: userTeam.id },
            {
              title,
              description,
              tracks,
              submissionLink,
              round1: true,
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
            round1: true,
          });
        }
      } else if (currentTime > round1Deadline && currentTime < round2Deadline) {
        if (
          submissionAlreadyExists &&
          submissionAlreadyExists.round1 === true
        ) {
          updatedSubmission = await submsissionModel.findOneAndUpdate(
            { team: userTeam.id },
            {
              title,
              description,
              tracks,
              submissionLink,
              round2: true,
            },
            { new: true }
          );
        } else {
          throw new Error(
            "You are not eligible for this round of submission as you did not submit your round 1 progress!"
          );
        }
      } else if (currentTime > round2Deadline && currentTime < round3Deadline) {
        if (
          submissionAlreadyExists &&
          submissionAlreadyExists.round1 === true &&
          submissionAlreadyExists.round2 === true &&
          submissionAlreadyExists.selectedForRound3 === true
        ) {
          updatedSubmission = await submsissionModel.findOneAndUpdate(
            { team: userTeam.id },
            {
              title,
              description,
              tracks,
              submissionLink,
              round3: true,
            },
            { new: true }
          );
        } else {
          throw new Error(
            "You are not eligible for this round of submission. Better luck next time!"
          );
        }
      } else {
        throw new Error("Submissions have ended!");
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
      const currentTime = moment().tz("Asia/Kolkata");
      const round1Deadline = moment.tz(
        process.env.round_1_deadline,
        "Asia/Kolkata"
      );
      const round2Deadline = moment.tz(
        process.env.round_2_deadline,
        "Asia/Kolkata"
      );
      const round3Deadline = moment.tz(
        process.env.round_3_deadline,
        "Asia/Kolkata"
      );
      let eligibilty: boolean;
      if (currentTime < round1Deadline) {
        eligibilty = true;
      } else if (currentTime > round1Deadline && currentTime < round2Deadline) {
        if (submissionAlreadyExists.round1 === true) {
          eligibilty = true;
        } else {
          eligibilty = false;
        }
      } else if (currentTime > round2Deadline && currentTime < round3Deadline) {
        if (
          submissionAlreadyExists.round1 === true &&
          submissionAlreadyExists.round2 === true &&
          submissionAlreadyExists.selectedForRound3 === true
        ) {
          eligibilty = true;
        } else {
          eligibilty = false;
        }
      } else {
        throw new Error("Submissions have ended!");
      }

      if (submissionAlreadyExists) {
        new SuccessResponse("Submission has been sent", {
          submissionAlreadyExists,
          userTeam,
          eligibilty,
        }).send(res);
      } else {
        new SuccessResponse("Submission has been sent", {
          data: null,
          userTeam,
          eligibilty,
        }).send(res);
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
      const currentTime = moment().tz("Asia/Kolkata");
      const round1Deadline = moment.tz(
        process.env.round_1_deadline,
        "Asia/Kolkata"
      );
      const round2Deadline = moment.tz(
        process.env.round_2_deadline,
        "Asia/Kolkata"
      );
      const round3Deadline = moment.tz(
        process.env.round_3_deadline,
        "Asia/Kolkata"
      );
      let nextDeadline: string;
      let currentRoundNo: number;

      if (currentTime < round1Deadline) {
        nextDeadline = round1Deadline.format();
        currentRoundNo = 1;
      } else if (currentTime > round1Deadline && currentTime < round2Deadline) {
        nextDeadline = round2Deadline.format();
        currentRoundNo = 2;
      } else if (currentTime > round2Deadline && currentTime < round3Deadline) {
        nextDeadline = round3Deadline.format();
        currentRoundNo = 3;
      } else {
        throw new Error("Submissions have ended!");
      }
      new SuccessResponse(
        "Deadline and Round No on submission portal have been sent",
        {
          currentRoundNo,
          nextDeadline,
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
