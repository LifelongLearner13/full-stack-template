/* eslint-env node */

// Basic 404 handling. If the router hasn't found a match
// by the time it reaches this then send back a not found message.
function notFound(request, response) {
  response.status(404).send({
    success: false,
    message: '404: cannot find route'
  });
}

module.exports = app => {
  app.use(notFound); // Must come after all other routes and before the error handler
};
