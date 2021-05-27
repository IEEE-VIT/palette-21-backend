import Recaptcha from "recaptcha-verify";
import { Request, Response } from "express";
import { AuthFailureResponse } from "../core/ApiResponse";

const recaptcha = new Recaptcha({
  secret: process.env.RECAPTCHA_KEY,
  verbose: false,
});

const verifyCaptcha = (req: Request, res: Response, next: () => void): void => {
  try {
    const { token } = req.body;
    recaptcha.checkResponse(token, (error, response) => {
      if (response.success) {
        next();
      } else {
        new AuthFailureResponse("Could not verify ReCaptcha").send(res);
      }
    });
  } catch (error) {
    res.send(error);
  }
};

export default verifyCaptcha;
