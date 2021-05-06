import express from "express";
import User, { userModel } from "../database/models/User";
import Team, { TeamModel } from "../database/models/Team";

import { SuccessResponse, InternalErrorResponse } from "../core/ApiResponse";

class DashboardController {
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

      const pageNumber = (skipValue - 1) * limitValue;
      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }
      const size: number = await userModel.countDocuments({
        name: { $regex: name, $options: "i" },
        _id: { $ne: req.user.id },
      });

      const users: Array<User> = await userModel
        .find({
          name: { $regex: name, $options: "i" },
          _id: { $ne: req.user.id },
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
      const totalTeams: number = await TeamModel.countDocuments({
        name: { $regex: name, $options: "i" },
      });

      const teams: Array<Team> = await TeamModel.find({
        name: { $regex: name, $options: "i" },
      })
        .skip(pageNumber)
        .limit(limitValue);

      // check users team too and dont show it

      new SuccessResponse("These teams match the search criteria", {
        totalTeams,
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
      const totalTeams: number = (await TeamModel.countDocuments()) - 1;

      const teams: Array<Team> = await TeamModel.find()
        .skip(pageNumber)
        .limit(limitValue);
      // check users team too and dont show it

      new SuccessResponse("These teams are found", { totalTeams, teams }).send(
        res
      );
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

      const size: number = await userModel.countDocuments({
        needTeam: true,
        _id: { $ne: req.user.id },
      });

      const users: Array<User> = await userModel
        .find({
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

  needTeam = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      await userModel.findOneAndUpdate(
        {
          // change to req.user
          _id: req.body.id,
          // take this also from req.user.needteam
          needTeam: req.user.needTeam,
        },
        {
          needTeam: !req.user.needTeam,
        }
      );
      new SuccessResponse("The user's team status has been updated", true).send(
        res
      );
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error finding a team").send(res);
    }
  };

  editTeam = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    try {
      await TeamModel.findOneAndUpdate(
        {
          // change to req.user
          "users.id": req.user.id,
          // take this also from req.user.needteam
        },
        {
          name: req.body.name,
        }
      );
      new SuccessResponse("The user's team status has been updated", true).send(
        res
      );
    } catch (error) {
      console.log(error);
      new InternalErrorResponse("Error finding a team").send(res);
    }
  };
}

export default DashboardController;
