import { Request, Response } from "express";
import { InviteModel } from "../database/models/Invite";
import { TeamModel } from "../database/models/Team";

class InviteController {
  myInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const invites = await InviteModel.find({ sentTo: req.user._id });
      res.send(invites);
    } catch (error) {
      console.error(error);
    }
  };

  addInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const invite = await new InviteModel({
        team: req.body.teamId,
        // eslint-disable-next-line no-underscore-dangle
        sentBy: req.user._id,
        sentTo: req.body.userId,
      });
      invite.save();
      res.send("Invite sent");
    } catch (error) {
      console.error(error);
    }
  };

  sentInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const invites = await InviteModel.find({ sentBy: req.user._id });
      res.send(invites);
    } catch (error) {
      console.error(error);
    }
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const code = req.params.teamCode;
      const updatedTeam = await TeamModel.findOneAndUpdate(
        { teamCode: code },
        {
          // eslint-disable-next-line no-underscore-dangle
          $push: { users: req.user._id },
        }
      );
      res.send("Team joined");
      // eslint-disable-next-line no-underscore-dangle
      console.log(updatedTeam);
    } catch (error) {
      console.error(error);
    }
  };
}

export default InviteController;
