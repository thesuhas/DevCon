import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';
import post from './post';
import profile from './profile';

// Add all reducers here to combine at once and send
export default combineReducers({
    alert,
    auth,
    profile,
    post
});