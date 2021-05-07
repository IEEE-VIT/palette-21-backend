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

  sendInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const invitesSent = await InviteModel.find({ sentBy: req.user.id });
      const invite = {
        teamCode: req.body.teamCode,
        sentBy: req.user.id,
        sentTo: req.body.userId,
      };
      if (req.user.id === req.body.userId) {
        throw new Error("You cannot send an invite to yourself");
      }
      const inviteReceiver = await UserModel.findById(req.body.userId);
      if (!inviteReceiver.needTeam) {
        throw new Error("User does not need a team");
      }

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
        new SuccessResponse("Invite has been succesfully sent.", invite).send(
          res
        );
      } else {
        throw new Error("You cannot send an invite to this person now.");
      }
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Error sending an invite").send(res);
    }
  };

  sentInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const invites = await InviteModel.find({ sentBy: req.user.id });
      res.send(invites);
    } catch (error) {
      console.error(error);
    }
  };

  joinTeamByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamCode } = req.body;
      const { id } = req.user;
      let teammateId;
      const teamFromCodeEntered = await TeamModel.findOneAndUpdate(
        { teamCode },
        {
          $push: { users: req.user.id },
        }
      );
      const userInTheSameTeam = teamFromCodeEntered.users.some(
        (userId: any) => {
          if (!userId.equals(id)) {
            teammateId = userId;
          }
          return userId.equals(id);
        }
      );
      if (userInTheSameTeam) {
        throw new Error("User is in the same team");
      }
      if (!teamFromCodeEntered) {
        throw new Error("Please check the team code again");
      }
      const updateJoiningUser = await UserModel.findByIdAndUpdate(req.user.id, {
        teamCode,
        needTeam: false,
      });
      if (!updateJoiningUser) {
        throw new Error("Could not update the joining user");
      }
      const updateTeammate = await UserModel.findByIdAndUpdate(teammateId, {
        needTeam: false,
      });
      if (!updateTeammate) {
        throw new Error("Could not update the teammate's profile");
      }
      const deleteInvites = await InviteModel.deleteMany({
        $or: [{ teamCode }, { sentBy: req.user.id }],
      });
      if (!deleteInvites) {
        throw new Error("Could not delete invites");
      }
      new SuccessResponse("User has joined the team", true).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Unable to join team").send(res);
    }
  };

  rejectInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamCode } = req.body;
      await InviteModel.findOneAndDelete({ teamCode });
      res.send("Invite rejected");
    } catch (error) {
      console.error(error);
    }
  };
}

export default InviteController;
