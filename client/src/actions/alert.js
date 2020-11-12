import {SET_ALERT, REMOVE_ALERT} from './types';
import uuid from 'uuid';

// Dispatching actions to reducers
export const setAlert = (msg, alertType) => dispatch => { // Dispatch keyword due to thunk middleware
    // Creating random universal id
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    });
};