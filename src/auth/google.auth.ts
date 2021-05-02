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
  console.log("serialize");
  console.log("iska user", user);
  done(null, user);
});

passport.deserializeUser((user: Profile, done: any) => {
  console.log("deseralize");
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.client_id,
      clientSecret: process.env.client_secret,
      callbackURL: "/user/auth/google/callback",
    },
    (
      accessToken: string,
      refreshToken: undefined,
      profile: Profile,
      done: any
    ) => {
      console.log("access token: ", typeof accessToken, accessToken);
      console.log("profile: ", typeof profile, profile);

      return done(null, profile);
    }
  )
);
