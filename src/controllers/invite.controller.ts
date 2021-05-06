import { Request, Response } from "express";
import { InternalErrorResponse, SuccessResponse } from "../core/ApiResponse";
import { InviteModel } from "../database/models/Invite";
import { TeamModel } from "../database/models/Team";
import { UserModel } from "../database/models/User";

class InviteController {
  myInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const invites = await InviteModel.find({ sentTo: req.user.id });
      res.send(invites);
    } catch (error) {
      console.error(error);
    }
  };

  // test from here
  sendInvite = async (req: Request, res: Response): Promise<void> => {
    // addInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const invitesSent = await InviteModel.find({ sentBy: req.user.id });
      const invite = {
        teamCode: req.body.teamId,
        sentBy: req.user.id,
        sentTo: req.body.userId,
      };
      let valid = true;
      invitesSent.forEach((tempInvite) => {
        if (
          tempInvite.teamCode === invite.teamCode &&
          tempInvite.sentTo === invite.sentTo
        )
          valid = false;
      });
      if (invitesSent.length < 5 && valid) {
        await new InviteModel(invite).save();
        res.send("Invite sent");
      } else {
        res.send("Already 5 invites sent");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // try {
  //   const invitesSent = (await InviteModel.find({ sentBy: req.user.id }))
  //     .length;
  //   if (invitesSent < 5) {
  //     const invite = new InviteModel({
  //       teamCode: req.user.teamCode,
  //       sentBy: req.user.id,
  //       sentTo: req.body.userId,
  //     });
  //     invite.save();
  //     new SuccessResponse("Invite has been sent", true).send(res);
  //   } else {
  //     throw new Error("Invite could not be sent");
  //   }
  // } catch (error) {
  //   console.error(error);
  //   new InternalErrorResponse("Invite could not be sent").send(res);
  // }
  // };

  sentInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const invites = await InviteModel.find({ sentBy: req.user.id });
      res.send(invites);
    } catch (error) {
      console.error(error);
    }
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamCode } = req.body;
      await TeamModel.findOneAndUpdate(teamCode, {
        $push: { users: req.user.id },
      });
      await UserModel.findByIdAndUpdate(req.user.id, {
        teamCode,
      });
      await InviteModel.deleteMany({ sentBy: req.user.id });
      await InviteModel.deleteMany({ teamCode });
      res.send("Team joined");
    } catch (error) {
      console.error(error);
    }
  };

  joinTeamByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamCode } = req.body;
      TeamModel.findOneAndUpdate(
        { teamCode },
        {
          $push: { users: req.user.id },
        }
      )
        .then(async () => {
          await UserModel.findByIdAndUpdate(req.user.id, {
            teamCode,
          });
        })
        .then(async () => {
          await InviteModel.deleteMany({ teamCode });
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
