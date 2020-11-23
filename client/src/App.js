import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import {loadUser} from './actions/auth';
import './App.css';
// Redux
import {Provider} from 'react-redux'; // Connects react and redux, done by surrounding app from provider
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { Routes } from './components/routing/Routes';

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
			<Switch>
				<Route exact path="/" component= {Landing}/>
				<Route component={Routes}/>
			</Switch>
		</Fragment>
		</Router>
	</Provider>
)};

export default App;
