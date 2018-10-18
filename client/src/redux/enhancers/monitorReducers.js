const round = number => Math.round(number * 100) / 100;

/**
 * Log approximately how long a reducer takes to execute. This can prove
 * useful in testing and improving performance. Only added to the Redux
 * Store during development.
 * Source: https://redux.js.org/recipes/configuringyourstore
 * @param {Function} createStore - Redux function which sets up the store
 */
const monitorReducerEnhancer = createStore => (
  reducer,
  initialState,
  enhancer
) => {
  const monitoredReducer = (state, action) => {
    const start = performance.now();
    const newState = reducer(state, action);
    const end = performance.now();
    const diff = round(end - start);
    console.log('reducer process time:', diff);
    return newState;
  };

  return createStore(monitoredReducer, initialState, enhancer);
};

export default monitorReducerEnhancer;
