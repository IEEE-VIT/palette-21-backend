import { Request, Response } from "express";
import { startSession } from "mongoose";
import Logger from "../configs/winston";
import {
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
      const invites = await InviteModel.find(
        { sentBy: id },
        "-sentBy"
      ).populate("sentTo", "name skills tools");
      if (!invites) {
        new NotFoundResponse("You have not sent any invites yet").send(res);
      }
      new SuccessResponse(
        "Your sent invites have been displayed",
        invites
      ).send(res);
    } catch (error) {
      // console.error(error);
      Logger.error(
        ` ${req.user.email}:>> Error fetching sent invites:>> ${error}`
      );
      new InternalErrorResponse("Error fetching the invites you sent").send(
        res
      );
    }
  };

  receivedInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;

      const invites = await InviteModel.find(
        { sentTo: id },
        "-sentTo"
      ).populate("sentBy", "name skills tools");
      if (!invites) {
        new NotFoundResponse("You have not received any invites yet").send(res);
      }
      new SuccessResponse(
        "The invites you have received have been displayed",
        invites
      ).send(res);
    } catch (error) {
      // console.error(error);

      Logger.error(
        ` ${req.user.email}:>> Error fetching received invites:>> ${error}`
      );

      new InternalErrorResponse(error.message).send(res);
    }
  };

  sendInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, teamCode } = req.user;
      const { receiversId } = req.body;
      if (id === receiversId) {
        throw new Error("You cannot send an invite to yourself");
        // new ForbiddenResponse("You cannot send an invite to yourself").send(
        //   res
        // );
      }
      const inviteReceiver = await UserModel.findById(receiversId);
      if (!inviteReceiver) {
        throw new Error("Unable to find the recipient user");
      }

      if (!inviteReceiver.needTeam) {
        throw new Error("User does not need a team");
        // new ForbiddenResponse("User does not need a team").send(res);
      }
      const team = await TeamModel.findOne({ teamCode });
      if (!team) {
        throw new Error("Unable to fetch the given team");
      }
      const teamFull = await isTeamFull(null, team.id);
      if (teamFull) {
        throw new Error("Team is already full!");
        // new ForbiddenResponse("Team is already full!").send(res);
      }

      const sameInvite = await InviteModel.findOne({
        sentBy: id,
        sentTo: receiversId,
      });
      if (sameInvite) {
        throw new Error("You have already sent this user an invite ");
        // new ForbiddenResponse("You have already sent this user an invite").send(
        //   res
        // );
      }
      const numberOfInvitesByUser = await InviteModel.countDocuments({
        sentBy: id,
      });
      if (numberOfInvitesByUser >= 5) {
        throw new Error(
          "You have already reached the limit of sending invites! Wait till a user rejects your invite to send more"
        );
        // new ForbiddenResponse(
        //   "You have already reached the limit of sending invites! Wait till a user rejects your invite to send more"
        // ).send(res);
      }

      const userIsInTeam = await TeamModel.findOne({
        users: id,
      });
      if (!userIsInTeam) {
        throw new Error("Please send an invite from your team");
        // new ForbiddenResponse("Please send an invite from your team").send(res);
      }

      const inviteSent = await InviteModel.create({
        teamId: team.id,
        sentBy: id,
        sentTo: receiversId,
      });
      if (!inviteSent) {
        throw new Error("Error sending an invite to the user");
        // new InternalErrorResponse("Error sending an invite to the user").send(
        //   res
        // );
      }
      new SuccessResponse("Invite sent succesfully", inviteSent).send(res);
    } catch (error) {
      // console.error(error);
      Logger.error(` ${req.user.email}:>> Error sending invite:>> ${error}`);
      new InternalErrorResponse(error.message).send(res);
    }
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    const session = await startSession();
    session.startTransaction();
    try {
      const { id, teamCode } = req.user;
      const { sentBy, teamId } = req.body;
      const teamFull = await isTeamFull(null, teamId);
      if (teamFull) {
        throw new Error("Team is already full!");
        // new ForbiddenResponse("Team is already full!").send(res);
      }
      const verifyInvite = await InviteModel.findOne({
        teamId,
        sentBy,
        sentTo: id,
      });
      // console.log(verifyInvite);

      if (!verifyInvite) {
        throw new Error("No such invite exists!");
        // new NotFoundResponse("No such invite exists").send(res);
      }

      const deletedInvite = await InviteModel.deleteOne({
        teamId,
        sentBy,
        sentTo: id,
      }).session(session);

      if (!deletedInvite) {
        throw new Error("Unable to delete invite");
      }

      const oldTeam = await TeamModel.findOne({
        teamCode: req.user.teamCode,
      });
      if (!oldTeam) {
        throw new Error("User does not have a team");
      }
      const usersInTeam = oldTeam.users;

      if (Number(usersInTeam.length) === 1) {
        const deleteOldTeam = await TeamModel.deleteOne({
          teamCode,
        }).session(session);

        if (!deleteOldTeam) {
          throw new Error("Unable to delete a team");
        }
        if (!deleteOldTeam.deletedCount) {
          throw new Error("Unable to delete a team");
        }
      }

      const updatedTeam = await TeamModel.findByIdAndUpdate(
        teamId,
        {
          $push: { users: id },
        },
        { new: true }
      ).session(session);
      if (!updatedTeam) {
        throw new Error("No such team exists!");
        // new NotFoundResponse("No such team exists").send(res);
      }
      const updatedUser = await UserModel.findByIdAndUpdate(id, {
        teamCode: updatedTeam.teamCode,
        needTeam: false,
      }).session(session);
      if (!updatedUser) {
        throw new Error("No such user found!");
        // new NotFoundResponse("No such user found").send(res);
      }
      await session.commitTransaction();

      new SuccessResponse("Invite has been accepted", updatedTeam).send(res);
    } catch (error) {
      // console.error(error);
      Logger.error(` ${req.user.email}:>> Error accepting invite:>> ${error}`);
      await session.abortTransaction();

      new InternalErrorResponse(error.message).send(res);
    } finally {
      session.endSession();
    }
  };

  joinTeamByCode = async (req: Request, res: Response): Promise<void> => {
    const session = await startSession();
    session.startTransaction();

    try {
      const { teamCode } = req.body;
      const { id } = req.user;
      const teamFull = await isTeamFull(teamCode, null);
      if (teamFull) {
        throw new Error("Team is already full!");
        // new ForbiddenResponse("Team is already full!").send(res);
      }
      let teammateId;
      const teamFromCodeEntered = await TeamModel.findOneAndUpdate(
        { teamCode },
        {
          $push: { users: id },
        }
      ).session(session);
      if (!teamFromCodeEntered) {
        throw new Error("Unable to find a team!");
        // new NotFoundResponse("Please check the team code again").send(res);
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
        throw new Error("User is in the same team!");
        // new ForbiddenResponse("User is in the same team").send(res);
      }
      const oldTeam = await TeamModel.findOne({
        teamCode: req.user.teamCode,
      });
      if (!oldTeam) {
        throw new Error("User does not have a team");
      }
      const usersInTeam = oldTeam.users;
      // console.log(usersInTeam.length);

      if (Number(usersInTeam.length) === 1) {
        const deleteOldTeam = await TeamModel.deleteOne({
          teamCode: req.user.teamCode,
        }).session(session);
        // console.log(deleteOldTeam);

        if (!deleteOldTeam) {
          throw new Error("Unable to delete a team");
        }
      }

      const updateJoiningUser = await UserModel.findByIdAndUpdate(id, {
        teamCode,
        needTeam: false,
      }).session(session);
      if (!updateJoiningUser) {
        throw new Error("User not found!");
        // new NotFoundResponse("User not found!").send(res);
      }
      const updateTeammate = await UserModel.findByIdAndUpdate(teammateId, {
        needTeam: false,
      }).session(session);
      if (!updateTeammate) {
        throw new Error("Teammate not found!");
        // new NotFoundResponse("Teammate not found!").send(res);
      }
      const deleteInvites = await InviteModel.deleteMany({
        $or: [{ teamCode }, { sentBy: id }],
      }).session(session);
      if (!deleteInvites) {
        throw new Error("Could not delete invites!");
        // new InternalErrorResponse("Could not delete invites").send(res);
      }
      await session.commitTransaction();
      new SuccessResponse("User has joined the team", true).send(res);
    } catch (error) {
      // console.error(error);
      // Logger.error(
      //   "Error joining by team code:>>",
      //   error.req.user.email,
      //   error
      // );
      Logger.error(
        ` ${req.user.email}:>> Error joining by team code:>> ${error}`
      );
      await session.abortTransaction();
      new InternalErrorResponse(error.message).send(res);
    } finally {
      session.endSession();
    }
  };

  cancelInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const { receiversId } = req.body;
      const exisitingInvite = await InviteModel.findOneAndDelete({
        sentBy: id,
        sentTo: receiversId,
      });
      if (!exisitingInvite) {
        throw new Error("Unable to find such an invite");
      }
      new SuccessResponse("Invite cancelled", true).send(res);
    } catch (error) {
      // console.error(error);
      Logger.error(` ${req.user.email}:>> Error cancelling invite:>> ${error}`);
      new InternalErrorResponse("Unable to cancel invite").send(res);
    }
  };

  rejectInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId } = req.body;
      const { id } = req.user;
      const deletedInvite = await InviteModel.findOneAndDelete({
        teamId,
        sentTo: id,
      });
      if (!deletedInvite) {
        new InternalErrorResponse("Error deleting the invites").send(res);
      }
      new SuccessResponse("User has rejected the invite", true).send(res);
    } catch (error) {
      // console.error(error)
      Logger.error(` ${req.user.email}:>> Error rejecting invite:>> ${error}`);
      new InternalErrorResponse(error.message).send(res);
    }
  };
}

export default InviteController;
