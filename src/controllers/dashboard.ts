import express from "express";
import { userModel } from "../database/models/User";
import { teamModel } from "../database/models/Team";

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

      const skipValue = parseInt(skip, 10);
      const limitValue = parseInt(limit, 10);

      const pageNumber = (skipValue - 1) * limitValue;
      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }
      const users = await userModel
        .find({
          name: { $regex: name, $options: "i" },
        })
        .skip(pageNumber)
        .limit(limitValue);
      new SuccessResponse("These users match the search criteria", users).send(
        res
      );
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

      const skipValue = parseInt(skip, 10);
      const limitValue = parseInt(limit, 10);

      const pageNumber = (skipValue - 1) * limitValue;
      const { name } = req.body;

      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }

      const teams = await teamModel
        .find({
          name: { $regex: name, $options: "i" },
        })
        .skip(pageNumber)
        .limit(limitValue);
      new SuccessResponse("These teams match the search criteria", teams).send(
        res
      );
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
      const skip = req.query.pageNumber as string;
      const limit = req.query.pageSize as string;

      const skipValue = parseInt(skip, 10);
      const limitValue = parseInt(limit, 10);

      const pageNumber = (skipValue - 1) * limitValue;

      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }

      const teams = await teamModel.find().skip(pageNumber).limit(limitValue);
      new SuccessResponse("These teams are found", teams).send(res);
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

      const skipValue = parseInt(skip, 10);
      const limitValue = parseInt(limit, 10);

      const pageNumber = (skipValue - 1) * limitValue;

      if (skipValue <= 0) {
        throw new Error("Enter a valid Page number");
      }
      if (limitValue <= 0) {
        throw new Error("Enter a valid Page size");
      }

      const users = await userModel
        .find({
          needTeam: true,
        })
        .skip(pageNumber)
        .limit(limitValue);
      new SuccessResponse("These users are found", users).send(res);
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
          needTeam: req.body.needTeam,
        },
        {
          needTeam: !req.body.needTeam,
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
      await teamModel.findOneAndUpdate(
        {
          // change to req.user
          _id: req.body.id,
          // take this also from req.user.needteam
          needTeam: req.body.needTeam,
        },
        {
          needTeam: !req.body.needTeam,
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
