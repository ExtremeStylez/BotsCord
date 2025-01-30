const passport = require('passport');
const { Strategy } = require('passport-discord');

const { users } = require('../models/users/user.js');
const env = process.env;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  users.findOne({ _id: id }).then(function (user) {
    done(null, user);
  });
});

passport.use(
  new Strategy(
    {
      clientID: env.clientId,
      clientSecret: env.clientSecret,
      callbackURL: env.callbackUri,
      scope: ['identify', 'email'],
      prompt: 'none',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('OAuth profile received:', profile);

      let user;
      try {
        user = await users.findOne({ id: profile.id });
        console.log('User lookup result:', user);
      } catch (err) {
        console.error('Error during user lookup:', err);
        return done(err);
      }

      if (!user) {
        console.log('User not found, creating new user...');
        try {
          console.log('Saving new user to database...');
          user = await new users({
            token: profile.id,
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            email: profile.email,
          }).save();
          console.log('New user created:', user);
        } catch (err) {
          console.error('Error creating new user:', err);
          return done(err);
        }
      }

      console.log('Returning user:', user);
      return done(null, user);
    }
  )
);
