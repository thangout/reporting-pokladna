import React from 'react';
import logo from './logo.svg';
import './App.css';

import Overview from './pages/Overview';
import Pay from './pages/Pay';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
    <div className="App">
      <ul>
        <li><Link to="/">Overview</Link></li>
        <li><Link to="/pay">Mzdy</Link></li>
      </ul>

      <Switch>
          <Route exact path="/">
            <Overview/>
          </Route>

          <Route path="/pay">
            <Pay/>
          </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
