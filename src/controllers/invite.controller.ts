import { Request, Response } from "express";
import {
  ClientSession,
  ObjectId,
  startSession,
  UpdateWriteOpResult,
} from "mongoose";
import Logger from "../configs/winston";
import {
  BadRequestResponse,
  InternalErrorResponse,
  NotFoundResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import Invite, { InviteModel } from "../database/models/Invite";
import Team, { TeamModel } from "../database/models/Team";
import User, { UserModel } from "../database/models/User";
import isTeamFull from "../helpers/TeamHelper";
import constants from "../constants";

class InviteController {
  sentInvites = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const invites: Invite[] = await InviteModel.find(
        { sentBy: id },
        "-sentBy"
      ).populate("sentTo", "name skills tools userImg");
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

      const invites: Invite[] = await InviteModel.find(
        { sentTo: id },
        "-sentTo"
      ).populate("sentBy", "name skills tools userImg");
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
      const inviteReceiver: User = await UserModel.findById(receiversId);
      if (!inviteReceiver) {
        throw new Error("Unable to find the recipient user");
      }

      if (!inviteReceiver.needTeam) {
        throw new Error("User does not need a team");
        // new ForbiddenResponse("User does not need a team").send(res);
      }
      const team: Team = await TeamModel.findOne({ teamCode });
      if (!team) {
        throw new Error("This team does not exist anymore");
      }
      const teamFull: boolean = await isTeamFull(null, team.id);
      if (teamFull) {
        throw new Error("Team is already full!");
        // new ForbiddenResponse("Team is already full!").send(res);
      }

      const sameInvite: Invite = await InviteModel.findOne({
        sentBy: id,
        sentTo: receiversId,
      });
      if (sameInvite) {
        throw new Error("You have already sent this user an invite ");
        // new ForbiddenResponse("You have already sent this user an invite").send(
        //   res
        // );
      }
      const numberOfInvitesByUser: number = await InviteModel.countDocuments({
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

      const userIsInTeam: Team = await TeamModel.findOne({
        users: id,
        teamCode,
      });
      if (!userIsInTeam) {
        throw new Error("Please send an invite from your team");
        // new ForbiddenResponse("Please send an invite from your team").send(res);
      }

      const inviteSent: Invite = await InviteModel.create({
        teamId: team.id,
        sentBy: id,
        sentTo: receiversId,
        status: constants.pendingInvite,
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
      new BadRequestResponse(error.message).send(res);
    }
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    const session: ClientSession = await startSession();
    session.startTransaction();
    try {
      const { id, teamCode } = req.user;
      const { sentBy, teamId } = req.body;
      const teamFull: boolean = await isTeamFull(null, teamId);
      if (teamFull) {
        throw new Error("Team is already full!");
        // new ForbiddenResponse("Team is already full!").send(res);
      }
      const verifyInvite: Invite = await InviteModel.findOne({
        teamId,
        sentBy,
        sentTo: id,
        status: constants.pendingInvite,
      });
      // console.log(verifyInvite);

      if (!verifyInvite) {
        throw new Error("No such invite exists!");
        // new NotFoundResponse("No such invite exists").send(res);
      }
      const oldTeam: Team = await TeamModel.findOne({
        teamCode,
        users: id,
      });
      if (!oldTeam) {
        throw new Error("User does not have a team");
      }
      const usersInTeam: Array<ObjectId> = oldTeam.users;

      const updatedInvite = await InviteModel.updateOne(
        {
          teamId,
          sentBy,
          sentTo: id,
          status: constants.pendingInvite,
        },
        {
          status: constants.acceptedInvite,
        }
      ).session(session);

      if (!updatedInvite) {
        throw new Error("Unable to accept invite");
      }

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
      } else {
        const updateOldTeam: Team = await TeamModel.findByIdAndUpdate(
          oldTeam.id,
          {
            $pull: { users: id },
          },
          { new: true }
        ).session(session);
        if (!updateOldTeam) {
          throw new Error("Unable to update the user's previous team");
        }
      }

      const updatedTeam: Team = await TeamModel.findByIdAndUpdate(
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
      const updatedUser: User = await UserModel.findByIdAndUpdate(id, {
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
      Logger.error(`${req.user.email}:>> Error accepting invite:>> ${error}`);
      await session.abortTransaction();

      new BadRequestResponse(error.message).send(res);
    } finally {
      session.endSession();
    }
  };

  joinTeamByCode = async (req: Request, res: Response): Promise<void> => {
    const session: ClientSession = await startSession();
    session.startTransaction();

    try {
      const { teamCode } = req.body;
      const { id } = req.user;
      const teamFull: boolean = await isTeamFull(teamCode, null);
      if (teamFull) {
        throw new Error(
          "Either team is already full or the team code is incorrect!"
        );
        // new ForbiddenResponse("Team is already full!").send(res);
      }
      let teammateId;
      const teamFromCodeEntered: Team = await TeamModel.findOneAndUpdate(
        { teamCode },
        {
          $push: { users: id },
        }
      ).session(session);
      if (!teamFromCodeEntered) {
        throw new Error(
          "Either team is already full or the team code is incorrect!"
        );
        // new NotFoundResponse("Please check the team code again").send(res);
      }
      const userInTheSameTeam: boolean = teamFromCodeEntered.users.some(
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
      const oldTeam: Team = await TeamModel.findOne({
        teamCode: req.user.teamCode,
      });
      if (oldTeam) {
        const usersInTeam = oldTeam.users;
        // console.log(usersInTeam.length);

        if (Number(usersInTeam.length) === 1) {
          const deleteOldTeam = await TeamModel.deleteOne({
            teamCode: req.user.teamCode,
          }).session(session);
          // console.log(deleteOldTeam);

          if (!deleteOldTeam) {
            throw new Error("Unable to delete your previous team");
          }
        } else {
          const updateOldTeam: Team = await TeamModel.findByIdAndUpdate(
            oldTeam.id,
            {
              $pull: { users: id },
            },
            { new: true }
          ).session(session);
          if (!updateOldTeam) {
            throw new Error("Unable to update the user's previous team");
          }
        }
      }

      const updateJoiningUser: User = await UserModel.findByIdAndUpdate(id, {
        teamCode,
        needTeam: false,
      }).session(session);
      if (!updateJoiningUser) {
        throw new Error("User not found!");
        // new NotFoundResponse("User not found!").send(res);
      }
      const updateTeammate: User = await UserModel.findByIdAndUpdate(
        teammateId,
        {
          needTeam: false,
        }
      ).session(session);
      if (!updateTeammate) {
        throw new Error("Teammate not found!");
        // new NotFoundResponse("Teammate not found!").send(res);
      }
      const rejectReceivedInvites: UpdateWriteOpResult =
        await InviteModel.updateMany(
          { sentTo: id },
          {
            status: constants.rejectedInvite,
          }
        ).session(session);

      if (!rejectReceivedInvites) {
        throw new Error("Could not reject your received invites!");
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
        `${req.user.email}:>> Error joining by team code:>> ${error}`
      );
      await session.abortTransaction();
      new BadRequestResponse(error.message).send(res);
    } finally {
      session.endSession();
    }
  };

  cancelInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const { receiversId } = req.body;
      const exisitingInvite: Invite = await InviteModel.findOneAndDelete({
        sentBy: id,
        sentTo: receiversId,
      });
      if (!exisitingInvite) {
        throw new Error("Unable to find such an invite");
      }
      new SuccessResponse("Invite cancelled", true).send(res);
    } catch (error) {
      // console.error(error);
      Logger.error(`${req.user.email}:>> Error cancelling invite:>> ${error}`);
      new BadRequestResponse("Unable to cancel invite").send(res);
    }
  };

  rejectInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId } = req.body;
      const { id } = req.user;
      const updatedInvite: Invite = await InviteModel.findOneAndUpdate(
        {
          teamId,
          sentTo: id,
        },
        { status: constants.rejectedInvite }
      );
      if (!updatedInvite) {
        Logger.error(
          `${req.user.email}:>> Error rejecting invite:>> No Updated Invites`
        );
        new BadRequestResponse("Error updated invite").send(res);
      }
      new SuccessResponse("User has rejected the invite", true).send(res);
    } catch (error) {
      // console.error(error)
      Logger.error(`${req.user.email}:>> Error rejecting invite:>> ${error}`);
      new InternalErrorResponse(error.message).send(res);
    }
  };
}

export default InviteController;
