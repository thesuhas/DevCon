import axios from 'axios';
import { setAlert } from './alert';
import {CLEAR_PROFILE, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, GET_PROFILES, GET_REPOS} from './types';

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
        dispatch({type: CLEAR_PROFILE});
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Get all profiles
export const getProfiles =  () => async dispatch => {
    dispatch({type: CLEAR_PROFILE}); // Clearing profile before you visit the page prevents the flashing of previous users profile
    try {
        // Will get profile from the user id
        const res = await axios.get('/api/profile');
    
        dispatch ({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Get a particular profile by USER ID
export const getProfileById =  userId => async dispatch => {
    try {
        // Will get profile from the user id
        const res = await axios.get(`/api/profile/user/${userId}`);
    
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

// Get GitHub Repos
export const getGithubRepos =  username => async dispatch => {
    try {
        // Will get profile from the user id
        const res = await axios.get(`/api/profile/github/${username}`);
    
        dispatch ({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Create or Update Profile
export const createProfile = (formData, history, edit=false) => async dispatch => {// History object has a method called push that can help us redirect to a client side route
    try {
        // Need to create config object to send data
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.post('/api/profile', formData, config);

        dispatch ({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", `success`)); // If edit is true, send alert that profile has been updated, else created

        // If creating profile, redirect
        if (!edit) {
            history.push('/dashboard'); // Cannot redirect normally in an action
        }

    } catch(err){
        const errors = err.response.data.errors; // Gets body errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });

    }

};

// Add experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        // Need to create config object to send data
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch ({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added', `success`)); // If edit is true, send alert that profile has been updated, else created

        history.push('/dashboard'); // Cannot redirect normally in an action

    } catch(err){
        const errors = err.response.data.errors; // Gets body errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });

    }
};

// Add Education
export const addEducation = (formData, history) => async dispatch => {
    try {
        // Need to create config object to send data
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch ({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Added', `success`)); // If edit is true, send alert that profile has been updated, else created

        history.push('/dashboard'); // Cannot redirect normally in an action

    } catch(err){
        const errors = err.response.data.errors; // Gets body errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });

    }
};

// Delete Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Removed', `success`));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Removed', `success`));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};

// Delete Account and Profile
export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This canNOT be undone!')) {
        try {
            await axios.delete('/api/profile');
    
            dispatch({type: CLEAR_PROFILE});
            dispatch({type: ACCOUNT_DELETED});
    
            dispatch(setAlert('Your account has been permanently deleted!'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: err.response.statusText, status: err.response.status}
            });
        }
    }
};