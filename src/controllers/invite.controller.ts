import { Request, Response } from "express";
import {
  ForbiddenResponse,
  InternalErrorResponse,
  NotFoundResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { InviteModel } from "../database/models/Invite";
import { TeamModel } from "../database/models/Team";
import { UserModel } from "../database/models/User";
import isTeamFull from "../helpers/TeamHelper";

class InviteController {
  sentInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const invites = await InviteModel.find({ sentBy: id });
      if (!invites) {
        new NotFoundResponse("You have not sent any invites yet").send(res);
      }
      new SuccessResponse(
        "Your sent invites have been displayed",
        invites
      ).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Error fetching the invites you sent").send(
        res
      );
    }
  };

  receivedInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;

      const invites = await InviteModel.find({ sentTo: id });
      if (!invites) {
        new NotFoundResponse("You have not received any invites yet").send(res);
      }
      new SuccessResponse(
        "The invites you have received have been displayed",
        invites
      ).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Error fetching the invites you received").send(
        res
      );
    }
  };

  sendInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const { receiversId, teamId } = req.body;
      if (id === receiversId) {
        new ForbiddenResponse("You cannot send an invite to yourself").send(
          res
        );
      }
      const inviteReceiver = await UserModel.findById(receiversId);
      if (!inviteReceiver.needTeam) {
        new ForbiddenResponse("User does not need a team").send(res);
      }
      const sameInvite = await InviteModel.find({
        sentBy: id,
        sentTo: receiversId,
      });
      if (sameInvite) {
        new ForbiddenResponse("You have already sent this user an invite").send(
          res
        );
      }
      const numberOfInvitesByUser = await InviteModel.countDocuments({
        sentBy: id,
      });
      if (numberOfInvitesByUser >= 5) {
        new ForbiddenResponse(
          "You have already reached the limit of sending invites! Wait till a user rejects your invite to send more"
        ).send(res);
      }

      const userIsInTeam = await TeamModel.findOne({
        users: id,
      });
      if (!userIsInTeam) {
        new ForbiddenResponse("Please send an invite from your team").send(res);
      }

      const inviteSent = await InviteModel.create({
        teamId,
        sentBy: id,
        sentTo: receiversId,
      });
      if (!inviteSent) {
        new InternalErrorResponse("Error sending an invite to the user").send(
          res
        );
      }
      new SuccessResponse("Invite sent succesfully", inviteSent).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse(
        "Error sending an invite! Please try again"
      ).send(res);
    }
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const { receiversId, teamId } = req.body;
      const teamFull = await isTeamFull(null, teamId);
      if (teamFull) {
        new ForbiddenResponse("Team is already full!").send(res);
      }
      const verifyInvite = await InviteModel.find({
        teamId,
        sentBy: id,
        sentTo: receiversId,
      });
      if (!verifyInvite) {
        new NotFoundResponse("No such invite exists").send(res);
      }
      const updatedTeam = await TeamModel.findByIdAndUpdate(teamId, {
        $push: { users: id },
      });
      if (!updatedTeam) {
        new NotFoundResponse("No such team exists").send(res);
      }
      const updatedUser = await UserModel.findByIdAndUpdate(id, {
        teamCode: updatedTeam.teamCode,
      });
      if (!updatedUser) {
        new NotFoundResponse("No such user found").send(res);
      }
      new SuccessResponse("Invite has been accepted", updatedTeam).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Error accepting the invite!").send(res);
    }
  };

  joinTeamByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamCode } = req.body;
      const { id } = req.user;
      const teamFull = await isTeamFull(teamCode, null);
      if (teamFull) {
        new ForbiddenResponse("Team is already full!").send(res);
      }
      let teammateId;
      const teamFromCodeEntered = await TeamModel.findOneAndUpdate(
        { teamCode },
        {
          $push: { users: id },
        }
      );
      if (!teamFromCodeEntered) {
        new NotFoundResponse("Please check the team code again").send(res);
      }
      const userInTheSameTeam = teamFromCodeEntered.users.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (userId: any) => {
          if (!userId.equals(id)) {
            teammateId = userId;
          }
          return userId.equals(id);
        }
      );
      if (userInTheSameTeam) {
        new ForbiddenResponse("User is in the same team").send(res);
      }
      const updateJoiningUser = await UserModel.findByIdAndUpdate(id, {
        teamCode,
        needTeam: false,
      });
      if (!updateJoiningUser) {
        new NotFoundResponse("User not found!").send(res);
      }
      const updateTeammate = await UserModel.findByIdAndUpdate(teammateId, {
        needTeam: false,
      });
      if (!updateTeammate) {
        new NotFoundResponse("Teammate not found!").send(res);
      }
      const deleteInvites = await InviteModel.deleteMany({
        $or: [{ teamCode }, { sentBy: id }],
      });
      if (!deleteInvites) {
        new InternalErrorResponse("Could not delete invites").send(res);
      }
      new SuccessResponse("User has joined the team", true).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Unable to join team").send(res);
    }
  };

  cancelInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      await InviteModel.findOneAndDelete({
        teamCode: req.user.teamCode,
        sentBy: req.user.id,
        sentTo: req.body.userId,
      });
      new SuccessResponse("Invite cancelled", true).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Unable to cancel invite").send(res);
    }
  };

  rejectInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId } = req.body;
      const { id } = req.user;
      const verifyInvite = await InviteModel.find({
        teamId,
        sentTo: id,
      });
      if (!verifyInvite) {
        new NotFoundResponse("No such invite exists").send(res);
      }
      const deletedInvite = await InviteModel.findOneAndDelete({ teamId });
      if (!deletedInvite) {
        new InternalErrorResponse("Error deleting the invites").send(res);
      }
      new SuccessResponse("User has rejected the invite", true).send(res);
    } catch (error) {
      console.error(error);
      new InternalErrorResponse("Unable to reject invite!").send(res);
    }
  };
}

export default InviteController;
