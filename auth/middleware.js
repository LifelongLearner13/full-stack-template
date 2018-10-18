/* eslint-env node */
const localStrategy = require('passport-local').Strategy;
const userModel = require('../user/userModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { JWT_KEY } = process.env;

module.exports = passport => {
  // Setup `signup` authentication middleware.
  // When called this will attempt to save the new user in the database.
  // If successful, is passes result on to the next step.
  passport.use(
    'signup',
    new localStrategy(
      {
        // Map keys used by client to those used by Passport
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          // Save the information provided by the user to the the database
          const result = await userModel.save(email, password);
          // Send the user information to the next middleware
          return done(null, result.user, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Setup `login` authentication middleware.
  // When called the provided email is sent to the database.
  // If a result is found, the passwords are checked.
  passport.use(
    'login',
    new localStrategy(
      {
        // Map keys used by client to those used by Passport
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          // Find the user associated with the email provided by the user
          const { success, message, user } = await userModel.find(email);

          if (!success) {
            // If the user isn't found in the database, return a message
            return done(null, false, { success, message });
          }

          // Validate password and make sure it matches with the corresponding hash stored in the database
          // If the passwords match, it returns a value of true.
          const validate = await userModel.isValidPassword(
            user.password,
            password
          );

          if (!validate) {
            // Not the right password, pass result on to the next middleware
            return done(null, false, {
              success: false,
              message: 'Wrong Password'
            });
          }

          // Send the validated user information to the next middleware
          return done(null, user, { success, message, user });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );

  // Makes information regarding the JWT available to the next step.
  passport.use(
    new JWTstrategy(
      {
        // secret we used to sign our JWT
        secretOrKey: JWT_KEY,
        // Extracts JWT from `authentication` header with schema bearer
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
      },
      async (token, done) => {
        try {
          // Pass the user details to the next middleware
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
