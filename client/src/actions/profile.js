import axios from 'axios';
import { setAlert } from './alert';
import {GET_PROFILE, PROFILE_ERROR} from './types';

// Get current users profile
export const getCurrentProfile =  () => async dispatch => {
    try {
        // Will get profile from the user id
        const res = await axios.get('/api/profile/me');
    
        dispatch ({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};