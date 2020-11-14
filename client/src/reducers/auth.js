import {REGISTER_SUCCESS, REGISTER_FAIL} from '../actions/types';

const initialState = {
    // Getting the tken from local storage
    token: localStorage.getItem('token'),
    isAuntheticated: null, // Will be set to true if user has successfully logged in
    loading: true, // Ensures loading is done, backend request has been finished
    user: null // User will get stored here
}

export default function(state = initialState, action){
    // Takes in action that is dispatched
    const {type, payload} = action;

    switch(type) {
        case REGISTER_SUCCESS: // User must get logged in
            localStorage.setItem('token', payload.token); // Stores token so that user can log in, first argument is name and second is value
            return {
                ...state,
                ...payload,
                isAuntheticated: true,
                loading: false
            }
        case REGISTER_FAIL: // Remove local storage of token
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuntheticated: false,
                loading: false
            }

        default: return state;
    }
}