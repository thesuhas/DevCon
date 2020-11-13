import {SET_ALERT, REMOVE_ALERT} from './types';
import { v4 as uuidv4} from 'uuid';

// Dispatching actions to reducers
export const setAlert = (msg, alertType, timeOut=5000) => dispatch => { // Dispatch keyword due to thunk middleware
    // Creating random universal id
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    });

    setTimeout(() => dispatch({type:REMOVE_ALERT, payload: id}), timeOut);
};