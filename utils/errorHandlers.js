/* eslint-env node */

// Universal error report. Specific error messages should be handled when they occure.
function globalErrorHandler(err, req, res, next) {
  if (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Something went wrong, please try again.'
    });
  }
}

module.exports = app => {
  app.use(globalErrorHandler); // Must come last in order to catch every error
};
