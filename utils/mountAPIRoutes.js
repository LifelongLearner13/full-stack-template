/* eslint-env node */
const auth = require('../auth');
const user = require('../user');

module.exports = (app, passport) => {
  const requireAuth = passport.authenticate('jwt', { session: false });

  app.use('/api/auth', auth);
  app.use('/api/user', requireAuth, user);
};
