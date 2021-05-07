import express from "express";
import User, { UserModel } from "../database/models/User";
import Team, { TeamModel } from "../database/models/Team";

import { SuccessResponse, InternalErrorResponse } from "../core/ApiResponse";

class DashboardController {
  toggleNeedTeam = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      await UserModel.findOneAndUpdate(
        {
          _id: req.user.id,
          needTeam: req.user.needTeam,
        },
        {
          needTeam: !req.user.needTeam,
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
      const { name } = req.body;
      const skip = req.query.pageNumber as string;
      const limit = req.query.pageSize as string;

      const skipValue: number = parseInt(skip, 10);
      const limitValue: number = parseInt(limit, 10);

      const pageNumber: number = (skipValue - 1) * limitValue;
      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }
      const size: number = await UserModel.countDocuments({
        name: { $regex: name, $options: "i" },
        _id: { $ne: req.user.id },
        needTeam: true,
      });

      const users: Array<User> = await UserModel.find({
        name: { $regex: name, $options: "i" },
        _id: { $ne: req.user.id },
        needTeam: true,
      })
        .skip(pageNumber)
        .limit(limitValue);
      new SuccessResponse("These users match the search criteria", {
        size,
        users,
      }).send(res);
    } catch (e) {
      console.log(e);
      new InternalErrorResponse("Error searching a user").send(res);
    }
  };

  searchTeams = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      const skip = req.query.pageNumber as string;
      const limit = req.query.pageSize as string;

      const skipValue: number = parseInt(skip, 10);
      const limitValue: number = parseInt(limit, 10);

      const pageNumber: number = (skipValue - 1) * limitValue;
      const { name } = req.body;

      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }
      const size: number = await TeamModel.countDocuments({
        name: { $regex: name, $options: "i" },
        users: { $ne: req.user.id },
      });

      const teams: Array<Team> = await TeamModel.find({
        name: { $regex: name, $options: "i" },
        users: { $ne: req.user.id },
      })
        .populate("users")
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

  findTeams = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      console.log(req.user);

      const skip = req.query.pageNumber as string;
      const limit = req.query.pageSize as string;

      const skipValue: number = parseInt(skip, 10);
      const limitValue: number = parseInt(limit, 10);

      const pageNumber: number = (skipValue - 1) * limitValue;

      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }
      const size: number = await TeamModel.countDocuments({
        users: { $ne: req.user.id },
      });

      const teams: Array<Team> = await TeamModel.find({
        users: { $ne: req.user.id },
      })
        .populate("users")
        .skip(pageNumber)
        .limit(limitValue);

      new SuccessResponse("These teams are found", { size, teams }).send(res);
    } catch (e) {
      console.log(e);
      new InternalErrorResponse("Error finding a team").send(res);
    }
  };

  // work on error handling
  findTeammates = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      const skip = req.query.pageNumber as string;
      const limit = req.query.pageSize as string;

      const skipValue: number = parseInt(skip, 10);
      const limitValue: number = parseInt(limit, 10);

      const pageNumber: number = (skipValue - 1) * limitValue;

      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }

      const size: number = await UserModel.countDocuments({
        needTeam: true,
        _id: { $ne: req.user.id },
      });

      const users: Array<User> = await UserModel.find({
        needTeam: true,
        _id: { $ne: req.user.id },
      })
        .skip(pageNumber)
        .limit(limitValue);

      new SuccessResponse("These users are found", { size, users }).send(res);
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error finding teammates").send(res);
    }
  };

  editTeamName = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      const updatedTeam = await TeamModel.findOneAndUpdate(
        {
          users: req.user.id,
        },
        {
          name: req.body.name,
        },
        { new: true }
      );
      if (updatedTeam.name !== req.body.name) {
        throw new Error("Couldn't update team name");
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
