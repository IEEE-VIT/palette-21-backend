import { Request, Response } from "express";
import { InternalErrorResponse, SuccessResponse } from "../core/ApiResponse";
import { InviteModel } from "../database/models/Invite";
import { TeamModel } from "../database/models/Team";
import { UserModel } from "../database/models/User";

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
      // eslint-disable-next-line no-underscore-dangle
      const invitesSent = (await InviteModel.find({ sentBy: req.user._id }))
        .length;
      if (invitesSent < 5) {
        const invite = await new InviteModel({
          team: req.body.teamId,
          // eslint-disable-next-line no-underscore-dangle
          sentBy: req.user._id,
          sentTo: req.body.userId,
        });
        invite.save();
        res.send("Invite sent");
      } else {
        res.send("Already 5 invites sent");
      }
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
      await TeamModel.findByIdAndUpdate(req.body.team, {
        $push: { users: req.user.id },
      })
        .then(async () => {
          await UserModel.findByIdAndUpdate(req.user.id, {
            teamCode: (await TeamModel.findById(req.body.team)).teamCode,
          });
        })
        .then(async () => {
          await InviteModel.deleteMany({ sentBy: req.user.id });
        });
      res.send("Team joined");
    } catch (error) {
      console.error(error);
    }
  };

  joinTeamByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      TeamModel.findOneAndUpdate(
        { teamCode: req.body.teamCode },
        {
          $push: { users: req.user.id },
        }
      )
        .then(async () => {
          await UserModel.findByIdAndUpdate(req.user.id, {
            teamCode: req.body.teamCode,
          });
        })
        .then(async () => {
          await InviteModel.deleteMany({ sentBy: req.user.id });
        });
      new SuccessResponse("User has joined the team", true).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Unable to join team").send(res);
    }
  };

  rejectInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      await InviteModel.findByIdAndDelete(req.body.invite_id);
      res.send("Invite rejected");
    } catch (error) {
      console.error(error);
    }
  };
}

export default InviteController;
