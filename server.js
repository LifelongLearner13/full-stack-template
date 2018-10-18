/* eslint-env node */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const mountAPIRoutes = require('./utils/mountAPIRoutes');
const mountErrorHandler = require('./utils/errorHandlers');
const mount404 = require('./utils/404Handler');
const mountAuth = require('./auth/middleware');

/* ---- Initial Setup ---- */
const app = express();

// Parse all request bodies to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// log every HTTP request to the console when in development
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

// Enable CORS from client-side
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  // The Fetch API does not send Authentication headers with OPTION requests
  // This allows the OPTIONS request to complete successfully without requiring
  // authentication.
  if (req.method === 'OPTIONS') {
    res.end();
  } else {
    next();
  }
});

/* ---- Serve files/data ---- */

// When in Production serve static files. In development static files are
// are handled via Webpack's dev server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Setup authentication
mountAuth(passport);

// Setup API routes
mountAPIRoutes(app, passport);

// Must come right before the error handlers
mount404(app);

// Must be the last thing mounted
mountErrorHandler(app);

/* ---- Set port and start server ---- */

const runServer = callback => {
  let port =
    process.env.NODE_ENV === 'production'
      ? process.env.PORT
      : process.env.DEVELOPMENT_PORT;

  const server = app.listen(port, () => {
    console.log(
      `Node app is running on port: ${port} with environment: ${
        process.env.NODE_ENV
      }`
    );
    if (callback) {
      callback(server);
    }
  });
};

// If file is called directly, then run server.
// Allows for testing the code.
if (require.main === module) {
  runServer();
}

exports.app = app;
exports.runServer = runServer;
