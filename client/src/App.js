import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import {loadUser} from './actions/auth';
import './App.css';
// Redux
import {Provider} from 'react-redux'; // Connects react and redux, done by surrounding app from provider
import store from './store';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
	// Pasted here as well because in action, run only once but here run continuously
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect( () => {
		store.dispatch(loadUser());
	}, []); // Second parameter with empty brackets makes it run once while mount and unmount
	
	return (
	<Provider store={store}>
		<Router>
		<Fragment>
			<Navbar/>
			<Route exact path="/" component= {Landing}/>
			<section className="container">
			<Alert/>
			<Switch>
				<Route exact path="/register" component={Register}/>
				<Route exact path="/login" component={Login}/>
				<PrivateRoute exact path="/dashboard" component={Dashboard}/>
				<PrivateRoute exact path="/create-profile" component={CreateProfile}/>
			</Switch>
			</section>
		</Fragment>
		</Router>
	</Provider>
)};

export default App;
