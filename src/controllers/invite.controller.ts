import { Request, Response } from "express";
import { InviteModel } from "../database/models/Invite";
import { TeamModel } from "../database/models/Team";

class InviteController {
  myInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const invites = await InviteModel.find({ recipient: req.params.userId });
      res.send(invites);
    } catch (error) {
      console.error(error);
    }
  };

  addInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const invite = await new InviteModel(req.body);
      invite.save();
      res.send("Invite sent");
    } catch (error) {
      console.error(error);
    }
  };

  sentInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const invites = await InviteModel.find({ teamCode: req.params.code });
      res.send(invites);
    } catch (error) {
      console.error(error);
    }
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      const updatedTeam = await TeamModel.findOneAndUpdate(
        { teamCode: code },
        {
          $push: { users: req.body.userId },
        }
      );
      res.send(updatedTeam);
    } catch (error) {
      console.error(error);
    }
  };
}

export default InviteController;
