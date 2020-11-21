import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_REPOS, GET_PROFILES } from "../actions/types";

// Creating initial state
const initialState = {
    profile: null, // Set null by default, going to put all profile data and put there along with any other user's data that has been visited
    profiles:[], // For the profile listing page
    repos: [], // For the repos
    loading: true,
    error: {} // Error object for any potential errors
};

export default function (state=initialState, action) {
    const {type, payload} = action;

    switch(type) {
        case UPDATE_PROFILE:
        case GET_PROFILE:
            return {
                ...state, 
                profile: payload,
                loading: false
            }
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload, // Sending payload as error as in actions file, if error occurs, payload contains error details
                loading:false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }
        default:
            return state;
    }
};