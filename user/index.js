/* eslint-env node */
const Router = require('express-promise-router');
const userModel = require('./userModel');

// Allows async functions as route handlers
const router = new Router();

// Return a user's details stored in the database. Requires requester to
// have a valid JWT token.
router.get('/profile', async (request, response) => {
  const { email } = request.user;
  const result = await userModel.find(email);
  response.json(result);
});

// Allows an authenticated user, to change their password
router.put('/password-change', async (request, response) => {
  const { email } = request.user;
  const newPswd = request.body.password;
  const result = await userModel.updatePswd(email, newPswd);
  response.json(result);
});

// Allows a user to delete their account.
router.delete('/delete', async (request, response) => {
  const { email } = request.user;
  const result = await userModel.del(email);
  response.json(result);
});

/* ---- User Preferences ---- */

// Retrieve preferences based on user's email
router.get('/preferences', async (request, response) => {
  const { email } = request.user;
  const result = await userModel.findPref(email);
  response.json(result);
});

// Update a user's preferences
router.put('/preferences', async (request, response) => {
  const { email } = request.user;
  const preferences = request.body;
  const result = await userModel.updatePref(email, preferences);
  response.json(result);
});

module.exports = router;
