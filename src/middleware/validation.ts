/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { UnprocessableEntry } from "../core/ApiResponse";
import Logger from "../configs/winston";

const bodyValidator =
  (schema: any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const errorMessages = details
        .map((i: Record<string, unknown>) => i.message)
        .join(",");
      Logger.error(` ${req.user.email}:>> Invalid body sent:>> ${error}`);
      new UnprocessableEntry(errorMessages).send(res);
    }
  };

const paramValidator =
  (paramSchema: any) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { error } = paramSchema.validate(req.query);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const errorMessages = details
        .map((i: Record<string, unknown>) => i.message)
        .join(",");
      Logger.error(
        ` ${req.user.email}:>> Invalid query params sent:>> ${error}`
      );
      new UnprocessableEntry(errorMessages).send(res);
    }
  };

const imageValidator = async (req: Request, file, callback): Promise<void> => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    Logger.error(`Invalid file format`);
    return callback(new Error("Only image files are allowed!"), false);
  }
  return callback(null, true);
};

export { bodyValidator, paramValidator, imageValidator };
