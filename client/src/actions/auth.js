// Bring in axios for http requests
import axios from "axios";
import {REGISTER_SUCCESS, REGISTER_FAIL} from './types';
import {setAlert} from './alert';

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