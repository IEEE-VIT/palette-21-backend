import { Request, Response } from "express";
import { ClientSession, startSession } from "mongoose";
import User, { UserModel } from "../database/models/User";
import Team, { TeamModel } from "../database/models/Team";

import {
  SuccessResponse,
  InternalErrorResponse,
  BadRequestResponse,
  NotFoundResponse,
} from "../core/ApiResponse";
import Logger from "../configs/winston";
import Invite, { InviteModel } from "../database/models/Invite";

class DashboardController {
  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const name: string = (req.query.name as string) || "";
      const skip: string = req.query.pageNumber;
      const limit: string = req.query.pageSize;

      const skipValue: number = parseInt(skip, 10);
      const limitValue: number = parseInt(limit, 10);
      const pageNumber: number = (skipValue - 1) * limitValue;

      if (skipValue <= 0) {
        new BadRequestResponse("Enter a valid Page number").send(res);
      }
      if (limitValue <= 0) {
        new BadRequestResponse("Enter a valid Page size").send(res);
      }
      const size: number = await UserModel.countDocuments({
        name: { $regex: name, $options: "i" },
        _id: { $ne: id },
        needTeam: true,
      });

      const users: Array<User> = await UserModel.find(
        {
          name: { $regex: name, $options: "i" },
          _id: { $ne: id },
          needTeam: true,
        },
        "-firstLogin -teamCode -needTeam -outreach -email -discordHandle"
      )
        .sort({ _id: "-1" })
        .skip(pageNumber)
        .limit(limitValue);

      const inviteSent = await InviteModel.find(
        { sentBy: id },
        "sentTo status"
      );
      const usersWithInvites: { user: User; invited: Invite }[] = [];

      users.forEach((user) => {
        usersWithInvites.push({
          user,
          invited: inviteSent.find(
            (invite) => invite.sentTo.toString() === user.id
          ),
        });
      });

      new SuccessResponse("These users match the search criteria", {
        size,
        usersWithInvites,
      }).send(res);
    } catch (error) {
      // console.log(error);
      Logger.error(` ${req.user.email} :>> Error searching users:>> ${error}`);
      new BadRequestResponse("Error searching a user").send(res);
    }
  };

  searchTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const name: string = (req.query.name as string) || "";
      const skip: string = req.query.pageNumber;
      const limit: string = req.query.pageSize;

      const skipValue: number = parseInt(skip, 10);
      const limitValue: number = parseInt(limit, 10);
      const pageNumber: number = (skipValue - 1) * limitValue;

      if (skipValue <= 0) {
        new BadRequestResponse("Enter a valid Page number").send(res);
      }
      if (limitValue <= 0) {
        new BadRequestResponse("Enter a valid Page size").send(res);
      }
      const size: number = await TeamModel.countDocuments({
        name: { $regex: name, $options: "i" },
        users: { $ne: id },
      });

      const teams: Array<Team> = await TeamModel.find(
        {
          name: { $regex: name, $options: "i" },
          users: { $ne: id },
        },
        "-problemStatement -teamCode -tries"
      )
        .populate(
          "users",
          "-firstLogin -teamCode -needTeam -outreach -email -discordHandle"
        )
        .sort({ _id: "-1" })
        .skip(pageNumber)
        .limit(limitValue);

      new SuccessResponse("These teams match the search criteria", {
        size,
        teams,
      }).send(res);
    } catch (error) {
      // console.log(error);
      Logger.error(
        ` ${req.user.email}:>> Error fetching searched teams:>> ${error}`
      );
      new InternalErrorResponse("Error searching a team").send(res);
    }
  };

  toggleNeedTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, needTeam } = req.user;
      await UserModel.findOneAndUpdate(
        {
          _id: id,
          needTeam,
        },
        {
          needTeam: !needTeam,
        }
      );
      new SuccessResponse(
        "The user's team status has been updated",
        !needTeam
      ).send(res);
    } catch (error) {
      // console.log(error);
      Logger.error(
        ` ${req.user.email}:>> Error toggling need team:>> ${error}`
      );
      new InternalErrorResponse("Error finding a team").send(res);
    }
  };

  editTeamName = async (req: Request, res: Response): Promise<void> => {
    const session: ClientSession = await startSession();
    session.startTransaction();
    try {
      const { id } = req.user;
      const { teamName } = req.body;
      await TeamModel.findOneAndUpdate(
        {
          users: id,
        },
        {
          name: teamName,
        },
        { new: true }
      ).session(session);
      // console.log(updatedTeam);

      const newUser: User = await UserModel.findOne({
        _id: id,
      }).session(session);
      // console.log(newUser);
      if (!newUser) {
        throw new Error("Unable to find User");
      }

      await session.commitTransaction();
      new SuccessResponse("The user's team status has been updated", true).send(
        res
      );
    } catch (error) {
      await session.abortTransaction();
      Logger.error(` ${req.user.email}:>> Error editing teamname:>> ${error}`);
      // console.log(error);
      new BadRequestResponse(error.message).send(res);
    } finally {
      session.endSession();
    }
  };

  profile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user;
      const user: User = await UserModel.findById(
        id,
        "-firstLogin -outreach -email"
      );
      const userInTeam: Team = await TeamModel.findOne(
        { users: id },
        "-teamCode -tries"
      ).populate("users", "-firstLogin -teamCode -needTeam -outreach -email");
      if (!user) {
        new NotFoundResponse("User not found!").send(res);
      }
      new SuccessResponse("User profile fetched", {
        user,
        team: userInTeam,
      }).send(res);
    } catch (error) {
      // console.log(error);
      Logger.error(` ${req.user.email}:>> Error fetching profile:>> ${error}`);
      new InternalErrorResponse("Unable to send User profile").send(res);
    }
  };
}

export default DashboardController;
