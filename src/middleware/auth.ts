/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */
import jwt from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt } from "passport-jwt";
import { userModel } from "../database/models/User";

const JwtStrategy = require("passport-jwt").Strategy;

const opts: any = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "userStrategy",
  new JwtStrategy(opts, async (jwtPayload: any, done: any) => {
    try {
      console.log(jwtPayload.id);
      console.log("hehehheehe");
      const user = await userModel.findById(jwtPayload.id);
      console.log(user);
      done(null, user);
    } catch (error) {
      console.log("JWT Middleware error:>>", error);
      done(null, false);
    }
  })
);

const generateJwtToken = (payload: object): string => {
  const token = jwt.sign(payload, opts.secretOrKey);
  console.log("jwt made");
  return token;
};

export default generateJwtToken;
