import React, { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import './App.css';

{/* If only single element is being returned, no need of curly braces*/}
{/* Fragment are ghost elements, won't show up in dom */}

const App = () => 
    <Fragment>
      <Navbar/>
      <Landing/>
    </Fragment>

export default App;
