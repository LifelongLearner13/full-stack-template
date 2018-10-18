import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

/**
 * Much simpler version of `configureStore.dev.js`. Setup the Redux store for production use.
 * @param {Object} preloadedState - An object containing any starting values for the Redux store
 */
export default function configureStore(preloadedState) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares)
  );

  // Start Redux Saga
  sagaMiddleware.run(rootSaga);

  return store;
}
