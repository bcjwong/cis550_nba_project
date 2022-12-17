const express = require('express');
const mysql = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

app.get('/player', routes.player)

app.get('/top_teams', routes.top_5_teams)

app.get('/games/:season', routes.all_games)

app.get('/search/game_details', routes.games_details)

app.get('/game', routes.game)

app.get('/teams', routes.all_teams)

app.get('/team', routes.team)

app.get('/team_players', routes.team_players)

app.get('/teams_conference', routes.teams_conference)

app.get('/players', routes.all_players)

app.get('/search/players', routes.search_players)





app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;