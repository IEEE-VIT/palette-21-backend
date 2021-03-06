/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-types */

import passport from "passport";

const GoogleStrategy = require("passport-google-oauth20").Strategy;

interface Profile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: [
    {
      value: string;
      verified: boolean;
    }
  ];
  photos: [
    {
      value: string;
    }
  ];
}

passport.serializeUser((user: object, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: Profile, done: any) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.client_id,
      clientSecret: process.env.client_secret,
      callbackURL: "/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: undefined,
      profile: Profile,
      done: any
    ) => {
      if (accessToken) {
        const name: string = profile.displayName;
        const email: string = profile.emails[0].value;
        const imgUrl: string = profile.photos[0].value;

        const user = {
          name,
          email,
          imgUrl,
        };

        return done(null, user);
      }
      throw new Error("Google Login Failed");
    }
  )
);
