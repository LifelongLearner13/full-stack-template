import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import monitorReducersEnhancer from './enhancers/monitorReducers';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

/**
 * Configure the Redux store with enhancers and middleware designed to make development
 * easier. If the Redux DevTools browser extension is installed, it is hooked into the Redux store.
 * If no extension is found, Redux Logger is added as a middleware in order to provide feedback in the
 * console.
 * For more information about this setup see: https://redux.js.org/recipes/configuringyourstore
 * @param {Object} preloadedState - An object containing any starting values for the Redux store
 */
export default function configureStore(preloadedState) {
  const sagaMiddleware = createSagaMiddleware();

  let middlewares = [sagaMiddleware];
  let store = null;

  // Redux's createStore function only takes one array of middleware,
  // since we are using an enhancer in addition to several middlewares we need
  // to combine them together using either Redux's compose or the function
  // provided by the Redux DevTools browser extension
  let composeEnhancers = compose;

  // Check if execution environment is a web browser and if the Redux DevTools
  // extension is installed
  if (
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) {
    // Use Redux DevTools extenstion and an enhancer that times each reducer.
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    const middlewareEnhancer = applyMiddleware(...middlewares);
    const enhancers = [middlewareEnhancer, monitorReducersEnhancer];

    store = createStore(
      rootReducer,
      preloadedState,
      composeEnhancers(...enhancers)
    );
  } else {
    // Default to Redux Logger
    middlewares.push(
      createLogger({
        duration: true, // Print how long action took
        timestamp: true, // Print timestamp when action took place
        collapsed: (getState, action) => action.type.includes('@@redux-form') // collapse Redux Form actions
      })
    );

    store = createStore(
      rootReducer,
      preloadedState,
      applyMiddleware(...middlewares)
    );
  }

  // Start the Redux Saga middleware
  let sagaTask = sagaMiddleware.run(function*() {
    yield rootSaga();
  });

  // If hot reloading is enabled, watch for changes and replace files when required
  if (module.hot) {
    module.hot.accept('./rootReducer', () => store.replaceReducer(rootReducer));
    module.hot.accept('./rootSaga', () => {
      sagaTask.cancel(); // Cancel any currently running Sagas
      sagaTask.done.then(
        // Restart the middleware
        () =>
          (sagaTask = sagaMiddleware.run(function*() {
            yield rootSaga();
          }))
      );
    });
  }

  return store;
}
