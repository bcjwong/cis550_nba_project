import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
// import MatchesPage from './pages/MatchesPage';
import TeamsPage from './pages/TeamsPage';
import GamesPage from './pages/GamesPage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"


ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
		path="/"
		render={() => (
			<HomePage />
		)}/>
        <Route exact
		path="/players"
		render={() => (
			<PlayersPage />
		)}/>
		<Route exact
		path="/teams"
		render={() => (
			<TeamsPage />
		)}/>
        <Route exact
		path="/games"
		render={() => (
			<GamesPage />
		)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);
