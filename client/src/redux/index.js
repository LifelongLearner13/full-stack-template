/**
 * Determine which configureStore to execute based on the
 * environment. This allows development specific code to
 * be stripped from a production build.
 */
if (process.env.NODE_ENV === 'production') {
  console.warn('Production Build');
  module.exports = require('./configureStore.prod');
} else {
  console.warn('Development Build');
  module.exports = require('./configureStore.dev');
}
