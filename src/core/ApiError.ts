/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
import { Response } from "express";

import {
  AuthFailureResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
} from "./ApiResponse";

enum ErrorType {
  BAD_TOKEN = "BadTokenError",
  UNAUTHORIZED = "AuthFailureError",
  ACCESS_TOKEN = "AccessTokenError",
  INTERNAL = "InternalError",
  NOT_FOUND = "NotFoundError",
  NO_DATA = "NoDataError",
  BAD_REQUEST = "BadRequestError",
  FORBIDDEN = "ForbiddenError",
}

export abstract class ApiError extends Error {
  constructor(public type: ErrorType, public message: string = "error") {
    super(type);
  }

  public static handle(err: ApiError, res: Response): Response {
    switch (err.type) {
      case ErrorType.BAD_TOKEN:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res);
      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message).send(res);
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(err.message).send(res);
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res);
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res);
      default: {
        return new InternalErrorResponse(err.message).send(res);
      }
    }
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = "Invalid Credentials") {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = "Internal error") {
    super(ErrorType.INTERNAL, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(ErrorType.BAD_REQUEST, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(ErrorType.NOT_FOUND, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Permission denied") {
    super(ErrorType.FORBIDDEN, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = "Token is not valid") {
    super(ErrorType.BAD_TOKEN, message);
  }
}

export class NoDataError extends ApiError {
  constructor(message = "No data available") {
    super(ErrorType.NO_DATA, message);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = "Invalid access token") {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}
