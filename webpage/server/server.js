const express = require('express');
const mysql = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

app.get('/player', routes.player)
//app.get('/player', routes.player)


// app.get('/players_season/:season', routes.playerInSeason)

// app.get('/playerInLeague', routes.playerInLeague)

// app.get('/highest_win_players', routes.highest_win_players)

app.get('/player_in_game', routes.player_in_game)

app.get('/top_teams', routes.top_5_teams)

app.get('/player_score_most', routes.player_score_most)

// app.get('/player_score_most_overall', routes.player_score_most_in_history)

//-- 12/11/2022
app.get('/games/:season', routes.all_games)

app.get('/search/game_details', routes.games_details)

app.get('/game', routes.game)

app.get('/teams', routes.all_teams)

app.get('/team', routes.team)

app.get('/team_players', routes.team_players)

app.get('/teams_conference', routes.teams_conference)



//--------------------------------------

// Route 1 - register as GET 
// app.get('/hello', routes.hello)

// Route 2 - register as GET 
// app.get('/jersey/:choice', routes.jersey)

// Route 3 - register as GET 
// app.get('/matches/:league', routes.all_matches)

// Route 4 - register as GET 
app.get('/players', routes.all_players)

// Route 5 - register as GET 
// app.get('/match', routes.match)

// Route 6 - register as GET 
app.get('/player', routes.player)

// Route 7 - register as GET 
// app.get('/search/matches', routes.search_matches)

// Route 8 - register as GET 
app.get('/search/players', routes.search_players)





app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;