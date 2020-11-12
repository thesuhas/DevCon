import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
// Middleware
import thunk from 'redux-thunk'; 

import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

// Creating store
const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware))); // Takes in root reducer, initial state and middleware

export default store;