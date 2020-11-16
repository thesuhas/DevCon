// Bring in axios for http requests
import axios from "axios";
import {REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR} from './types';
import {setAlert} from './alert';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch => {
    // Put token of logged in user in a global header that can always be sent
    if (localStorage.token) {
        // Checks local storage token, if exists, calls function to continuously send
        setAuthToken(localStorage.token);
    }

    // Making request
    try {
        // Gets the user and dispaches if token exists
        const res = axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}


// Register user
export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Preparing data
    const body = JSON.stringify({name, email, password});

    try {
        const res = await axios.post('api/users', body, config);

        // Dispatch action
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors; // Gets body errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: REGISTER_FAIL
        });
    }
}