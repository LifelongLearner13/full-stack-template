/* eslint-env node */
const Router = require('express-promise-router');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = process.env;

// create a new express-promise-router
// Same API as the normal express router except
// it allows async functions as route handlers
const router = new Router();

// Create a new user and assign them a new JWT token
router.post('/signup', async (request, response, next) => {
  passport.authenticate('signup', async (err, user, info) => {
    try {
      // If there was an error pass it along to the next middleware
      if (err) return next(err);

      // If there was an error when creating the user in the database, return message to user.
      if (!info.success) return response.json({ ...info });

      request.login(user, { session: false }, async error => {
        if (error) return next(error);

        // Content of the JWT token
        const body = { email: user.email };

        // Sign the JWT token and populate the payload
        const token = jwt.sign({ user: body }, JWT_KEY);

        // We need the user's password for Passport, but ensure it never is returned to the requester
        delete info.user.password;

        // Send results to the requester
        return response.json({ ...info, token });
      });
    } catch (error) {
      return next(error);
    }
  })(request, response, next);
});

// Authenticate user
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      // If there was an error pass it along to the next middleware
      if (err) return next(err);

      // If there was an error when creating the user in the database, return message to user.
      if (!info.success) return res.json({ ...info });

      req.login(user, { session: false }, async error => {
        if (error) return next(error);

        // Content of the JWT token
        const body = { email: user.email };

        // Sign the JWT token and populate the payload
        const token = jwt.sign({ user: body }, 'top_secret');

        // We need the user's password for Passport, but ensure it never is returned to the requester
        delete info.user.password;

        // Send results to the requester
        return res.json({ ...info, token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
