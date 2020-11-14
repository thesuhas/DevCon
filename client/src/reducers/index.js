import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';

// Add all reducers here to combine at once and send
export default combineReducers({
    alert,
    auth
});