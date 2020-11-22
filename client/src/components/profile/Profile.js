import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import { Link } from 'react-router-dom';

const Profile = ({ match, getProfileById, profile: {profile, loading}, auth }) => {
    useEffect(() => {
        getProfileById(match.params.id); // Matches the url to the id
    }, [getProfileById]);


    // If profile is null or is loading, display spinner
    return (
        <Fragment>
            {profile === null || loading ? <Spinner/> : <Fragment>
                <Link to='/profiles' className="btn btn-light">Back To Profiles</Link>
                {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (<Link to='edit-profile' className='btn btn-dark'>Edit Profile</Link>)}
                </Fragment>}
        </Fragment>
    )
};

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth // Need auth state so that user can edit their own profile
});

export default connect(mapStateToProps, { getProfileById })(Profile);
