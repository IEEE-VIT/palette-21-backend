import express from "express";
import User, { UserModel } from "../database/models/User";
import Team, { TeamModel } from "../database/models/Team";

import {
  SuccessResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
} from "../core/ApiResponse";

class DashboardController {
  profile = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      const user = await UserModel.findOne(req.user.id);
      new SuccessResponse("User profile fetched", user).send(res);
    } catch (error) {
      new InternalErrorResponse("Not authenticated").send(res);
    }
  };

  toggleNeedTeam = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      const { id, needTeam } = req.user;
      await UserModel.findOneAndUpdate(
        {
          _id: id,
          needTeam,
        },
        {
          needTeam: !needTeam,
        },
        { new: true }
      );
      new SuccessResponse("The user's team status has been updated", true).send(
        res
      );
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error finding a team").send(res);
    }
  };

  searchUsers = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      const { id } = req.user;
      const { name } = req.body;
      const skip = req.query.pageNumber as string;
      const limit = req.query.pageSize as string;

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
        "-email -teamCode"
      )
        .skip(pageNumber)
        .limit(limitValue);
      new SuccessResponse("These users match the search criteria", {
        size,
        users,
      }).send(res);
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error searching a user").send(res);
    }
  };

  searchTeams = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      const { id } = req.user;
      const { name } = req.body;
      const skip = req.query.pageNumber as string;
      const limit = req.query.pageSize as string;

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

      const teams: Array<Team> = await TeamModel.find({
        name: { $regex: name, $options: "i" },
        users: { $ne: id },
      })
        .populate("users", "-email -teamCode")
        .skip(pageNumber)
        .limit(limitValue);

      new SuccessResponse("These teams match the search criteria", {
        size,
        teams,
      }).send(res);
    } catch (e) {
      console.log(e);
      new InternalErrorResponse("Error searching a team").send(res);
    }
  };

  editTeamName = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      const { id } = req.user;
      const { teamName } = req.body;
      const updatedTeam = await TeamModel.findOneAndUpdate(
        {
          users: id,
        },
        {
          name: teamName,
        },
        { new: true }
      );
      if (!updatedTeam) {
        new NotFoundResponse("No such team found").send(res);
      }
      new SuccessResponse(
        "The user's team status has been updated",
        updatedTeam
      ).send(res);
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error updating team name").send(res);
    }
  };
}

export default DashboardController;
