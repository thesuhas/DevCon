// Takes in a state and an action

// Importing alerts
import {SET_ALERT, REMOVE_ALERT} from '../actions/types';

// Alerts will be an object w a id, the msg and the alertType
const initialState = []

// Action has a type and data (payload)
export default function(state = initialState, action){
    const {type, payload} = action;

    switch(type){
        case SET_ALERT:
            return [...state, payload]; // Adds payload to state array
        case (REMOVE_ALERT):
            // Remove alert by id
            return state.filter(alert => alert.id !== payload);
        default: return state;
    }
};