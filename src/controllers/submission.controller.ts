import { Request, Response } from "express";
import { submsissionModel } from "../database/models/Submission";
import Team, { TeamModel } from "../database/models/Team";

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
      res.send(updatedSubmission);
    } catch (error) {
      res.send(error.message);
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
        res.send(submissionAlreadyExists);
      } else {
        throw new Error("Create a Submission first");
      }
    } catch (error) {
      res.send(error.message);
    }
  };
}

export default submission;
