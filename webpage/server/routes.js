const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// 12/11/2022
/* 
***************************************  HOME PAGE  *************************************** 

*/
async function all_games(req, res) {
        const season = req.params.season ? req.params.season : 2021

        const page = req.query.page
        const pagesize = req.query.pagesize ? req.query.pagesize : 10

        if (req.query.page && !isNaN(req.query.page)) {
            // This is the case where page is defined.
            // The SQL schema has the attribute OverallRating, but modify it to match spec! 
            // TODO: query and return results here:
            const start = (page-1) * pagesize

            connection.query(`
            SELECT game_id AS GameId, game_date_est AS Date, t.NICKNAME as Home, PTS_home, p.NICKNAME as Visitor, PTS_away
            from games
            join teams t on games.HOME_TEAM_ID = t.TEAM_ID
            join teams p on games.VISITOR_TEAM_ID = p.TEAM_ID
            WHERE Season=${season}
            ORDER BY GAME_DATE_EST DESC
            LIMIT ${pagesize} OFFSET ${start}`, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
        else {
            connection.query(`
            SELECT game_id AS GameId, game_date_est AS Date, t.NICKNAME as Home, PTS_home, p.NICKNAME as Visitor, PTS_away 
            from games
            join teams t on games.HOME_TEAM_ID = t.TEAM_ID
            join teams p on games.VISITOR_TEAM_ID = p.TEAM_ID
            WHERE Season=${season}
            ORDER BY GAME_DATE_EST DESC`, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
}

/*  
*************************************  game page *************************************  
*/
async function games_details(req, res){
    const home = req.query.home ? req.query.home : ""
    const visitor = req.query.visitor ? req.query.visitor : ""
    const season = req.query.season ? req.query.season : 2021

    connection.query(`SELECT game_id AS GameId, game_date_est AS Date, t.NICKNAME as Home, PTS_home, p.NICKNAME as Visitor, PTS_away 
    From games g
    Join teams t on g.HOME_TEAM_ID = t.TEAM_ID
    join teams p on g.VISITOR_TEAM_ID = p.TEAM_ID
    where t.NICKNAME LIKE "%${home}%"
    and p.NICKNAME LIKE "%${visitor}%"
    and season = ${season}
    ORDER BY game_date_est DESC 
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Route 5 (handler)
async function game(req, res) {
    // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests
    const id = req.query.id
    
    connection.query(`SELECT game_id AS GameId, game_date_est AS Date, t.NICKNAME as Home, PTS_home, p.NICKNAME as Visitor, PTS_away, 
    AST_home, REB_home, AST_away, REB_away, FG_PCT_home, FT_PCT_home, FG3_PCT_home, FG_PCT_away, FT_PCT_away, FG3_PCT_away
    From games g
    Join teams t on g.HOME_TEAM_ID = t.TEAM_ID
    join teams p on g.VISITOR_TEAM_ID = p.TEAM_ID
    WHERE game_id = ${id}`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
   
    // return res.json({error: "Not implemented"})
}

/* game page end */


async function all_teams(req, res){

    connection.query(`
    SELECT team_id as TeamId, nickname AS name, abbreviation AS abb, yearfounded AS year, arena
    FROM teams
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function team(req, res){
    const Name = req.query.id ? req.query.id : 1610612748

    connection.query(`
    SELECT team_id AS TeamId, nickname AS name, abbreviation AS abb, yearfounded AS year, arena
    FROM teams
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function team_players(req, res){
    const id = req.query.id ? req.query.id : 1610612737

    connection.query(`
    SELECT team_id AS TeamId, nickname AS name, LOGO AS logo, CURRENT_PLAYER_1 as cp1, CURRENT_PLAYER_2 AS cp2, CURRENT_PLAYER_3 AS cp3, CURRENT_PLAYER_4 AS cp4, CURRENT_PLAYER_5 AS cp5, CURRENT_PLAYER_6 AS cp6, CURRENT_PLAYER_7 AS cp7, 
    CURRENT_PLAYER_8 AS cp8, CURRENT_PLAYER_9 AS cp9, CURRENT_PLAYER_10 AS cp10, CURRENT_PLAYER_11 AS cp11, CURRENT_PLAYER_12 AS cp12, CURRENT_PLAYER_13 AS cp13, CURRENT_PLAYER_14 AS cp14, CURRENT_PLAYER_15 AS cp15, CURRENT_PLAYER_16 AS cp16, 
    CURRENT_PLAYER_17 AS cp17, CURRENT_PLAYER_18 AS cp18, CONFERENCE_LOGO AS conf_logo
    FROM teams
    WHERE team_id = ${id}
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function teams_conference(req, res){
    const conf = req.query.conference ? req.query.conference : ""
    const season = req.query.season ? req.query.season : 2021

    connection.query(`
    SELECT team_id AS TeamId, nickname, AVG(g.PTS_home) AS avg_pts_home, AVG(p.PTS_away) AS avg_pts_away
    FROM teams
    JOIN games g on teams.team_id = g.home_team_id
    JOIN games p on teams.team_id = p.VISITOR_TEAM_ID
    WHERE conference LIKE "%${conf}%"
    AND g.season=${season}
    AND p.season=${season}
    GROUP BY TeamId;
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

/////////////////////////////////////////2022-11-12////////////////
/*
************************************ Player Page **************************************
*/

async function player(req, res){
    const id = req.query.id
    const page = req.query.page
    const pagesize = req.query.pagesize ? req.query.pagesize : 10

    if (req.query.page && !isNaN(req.query.page)) {
        const start = (page-1) * pagesize
        connection.query(`
        WITH g AS (SELECT games.SEASON, games.GAME_DATE_EST, gd.PLAYER_ID, gd.MIN, gd.FG3_PCT, gd.FG_PCT, gd.FT_PCT, gd.PTS, gd.AST, gd.REB
                FROM games
                JOIN games_details gd on games.GAME_ID = gd.GAME_ID)
        SELECT p.PLAYER_NAME AS Name, g.SEASON, g.GAME_DATE_EST AS Date, g.MIN, g.FG3_PCT, g.FG_PCT, g.FT_PCT, g.PTS, g.AST, g.REB
        FROM players p
        LEFT JOIN g ON p.PLAYER_ID = g.PLAYER_ID
        WHERE g.PLAYER_ID = ${id}
        ORDER BY GAME_DATE_EST DESC
        LIMIT ${pagesize} OFFSET ${start}`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
   
    } else {
        // we have implemented this for you to see how to return results by querying the database
        connection.query(`
        WITH g AS (SELECT games.SEASON, games.GAME_DATE_EST, gd.PLAYER_ID, gd.MIN, gd.FG3_PCT, gd.FG_PCT, gd.FT_PCT, gd.PTS, gd.AST, gd.REB
                FROM games
                JOIN games_details gd on games.GAME_ID = gd.GAME_ID)
        SELECT p.PLAYER_NAME AS Name, g.SEASON, g.GAME_DATE_EST AS Date, g.MIN, g.FG3_PCT, g.FG_PCT, g.FT_PCT, g.PTS, g.AST, g.REB
        FROM players p
        LEFT JOIN g ON p.PLAYER_ID = g.PLAYER_ID
        WHERE g.PLAYER_ID = ${id}
        ORDER BY GAME_DATE_EST DESC`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}


async function player_in_game(req, res){
    const game_id = req.query.game_id ? req.query.game_id : 52000211
    connection.query(`WITH G AS (SELECT games_details.PLAYER_ID
            FROM games
            JOIN games_details
            ON games.game_id = games_details.game_id
            WHERE games.game_id = ${game_id})
        SELECT *
        FROM players P
        JOIN G ON P.PLAYER_ID = G.PLAYER_ID;`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

/* TEAMS PAGE */
async function top_5_teams(req, res){

    const season = req.query.season ? req.query.season : 2021

    connection.query(`
    WITH TEMP AS (
        SELECT season_id, team, MAX(G) as G, MAX(W) as W, MAX(L) as L FROM ranking
        WHERE SEASON_ID = ${season}
        GROUP BY season_id, team
    )
    Select rk, team, G, W, L, season_id AS season from (
    SELECT dense_rank() over (PARTITION BY season_id ORDER by W DESC) as rk, team, G, W, L, season_id
    from TEMP) a Where rk <= 5
    LIMIT 5;
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

/* PLAYER PAGE */
// Find the player who scores the most in each season 
async function player_score_most(req, res){
    connection.query(`SELECT MAX(total_point), Season, player_id from (
   SELECT Sum(PTS) as total_point, Season, player_id from
       (SELECT player_id, PTS, Season
        From games_details
        Left join games on games_details.game_id =games.game_id) temp
        group by Season, player_id) temp1
    group by Season, player_id;
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}



// Route 4 (handler)
async function all_players(req, res) {
    const Name = req.query.Name ? req.query.Name : ""
    const Season = req.query.Season ? req.query.Season : 2019
    const Team_name = req.query.Team ? req.query.Team : ""
    const page = req.query.page
    const pagesize = req.query.pagesize ? req.query.pagesize : 10

    if (req.query.page && !isNaN(req.query.page)) {
        const start = (page-1) * pagesize
        connection.query(`
        WITH p AS ( SELECT PLAYER_NAME AS Name, 
            PLAYER_ID, t.NICKNAME AS Team, SEASON AS Season
                    FROM players p
                    JOIN teams t on p.TEAM_ID = t.TEAM_ID
                    WHERE PLAYER_NAME LIKE '%${Name}%' AND t.NICKNAME LIKE '%${Team_name}%' AND SEASON = ${Season}
                    )
        SELECT p.Name, p.PLAYER_ID AS id, p.Team, p.Season, AVG(g.PTS) AS AVG_PTS, AVG(g.AST) AS AVG_AST, AVG(g.REB) AS AVG_REB
        FROM games_details g
        JOIN  p on g.PLAYER_ID = p.PLAYER_ID
        GROUP BY p.SEASON, p.Name, p.Team, p.Season
        ORDER BY p.Name
        LIMIT ${pagesize} OFFSET ${start}`, function (error, results, fields) {
            
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
   
    } else {
        // we have implemented this for you to see how to return results by querying the database
        connection.query(`
        WITH p AS ( SELECT PLAYER_NAME AS Name, PLAYER_ID, t.NICKNAME AS Team, SEASON AS Season
                    FROM players p
                    JOIN teams t on p.TEAM_ID = t.TEAM_ID
                    WHERE PLAYER_NAME LIKE '%${Name}%' AND t.NICKNAME LIKE '%${Team_name}%' AND SEASON = ${Season}
                    )
        SELECT p.Name, p.PLAYER_ID AS id, p.Team, p.Season, AVG(g.PTS) AS AVG_PTS, AVG(g.AST) AS AVG_AST, AVG(g.REB) AS AVG_REB
        FROM games_details g
        JOIN  p on g.PLAYER_ID = p.PLAYER_ID
        GROUP BY p.SEASON, p.Name, p.Team, p.Season
        ORDER BY p.Name`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}
// async function all_players(req, res) {
//     const page = req.query.page
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10
//     const Season = req.params.season ? req.params.season : 2021
//     const Name = req.query.Name ? req.query.Name : ""
//     const Team_name = req.query.Team ? req.query.Team : ""

//     if (req.query.page && !isNaN(req.query.page)) {
//         const start = (page-1) * pagesize
//         connection.query(`

//         WITH p AS ( SELECT PLAYER_NAME AS Name, PLAYER_ID, t.NICKNAME AS Team, SEASON AS Season
//             FROM players p
//             JOIN teams t on p.TEAM_ID = t.TEAM_ID

//             )
//         SELECT p.Name, p.Team, p.Season, AVG(g.PTS) AS AVG_PTS, AVG(g.AST) AS AVG_AST, AVG(g.REB) AS AVG_REB
//         FROM games_details g
//         JOIN  p on g.PLAYER_ID = p.PLAYER_ID
//         GROUP BY p.SEASON, p.Name, p.Team, p.Season
//         ORDER BY p.Name
//         LIMIT ${pagesize} OFFSET ${start}`, function (error, results, fields) {
            
//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });
   
//     } else {
//         // we have implemented this for you to see how to return results by querying the database
//         connection.query(`
//         WITH p AS ( SELECT PLAYER_NAME AS Name, PLAYER_ID, t.NICKNAME AS Team, SEASON AS Season
//             FROM players p
//             JOIN teams t on p.TEAM_ID = t.TEAM_ID
//             )
//         SELECT p.Name, p.Team, p.Season, AVG(g.PTS) AS AVG_PTS, AVG(g.AST) AS AVG_AST, AVG(g.REB) AS AVG_REB
//         FROM games_details g
//         JOIN  p on g.PLAYER_ID = p.PLAYER_ID
//         GROUP BY p.SEASON, p.Name, p.Team, p.Season
//         ORDER BY p.Name`, function (error, results, fields) {

//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });
//     }

// }


// ********************************************
//             MATCH-SPECIFIC ROUTES
// ********************************************

// Route 5 (handler)
// async function match(req, res) {
//     // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests
//     const id = req.query.id
    
//     // This is the case where page is defined.
//     // The SQL schema has the attribute OverallRating, but modify it to match spec! 
//     // TODO: query and return results here:
//     connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, 
//                     FullTimeGoalsA AS AwayGoals, HalfTimeGoalsH AS HTHomeGoals, HalfTimeGoalsA AS HTAwayGoals,
//                     ShotsH AS ShotsHome, ShotsA AS ShotsAway, ShotsOnTargetH AS ShotsOnTargetHome, ShotsOnTargetA AS ShotsOnTargetAway,
//                     FoulsH AS FoulsHome, FoulsA AS FoulsAway, CornersH AS CornersHome, CornersA AS CornersAway, YellowCardsH AS YCHome,
//                     YellowCardsA AS YCAway, RedCardsH AS RCHome, RedCardsA AS RCAway
//     FROM Matches
//     WHERE MatchId = ${id}`, function (error, results, fields) {

//         if (error) {
//             console.log(error)
//             res.json({ error: error })
//         } else if (results) {
//             res.json({ results: results })
//         }
//     });
   
//     // return res.json({error: "Not implemented"})
// }



// ********************************************
//             SEARCH ROUTES
// ********************************************

// Route 7 (handler)
// async function search_matches(req, res) {
//     // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
//     // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
//     const Home = req.query.Home ? req.query.Home : ""
//     const Away = req.query.Away ? req.query.Away : ""
//     const page = req.query.page
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10

//     if (req.query.page && !isNaN(req.query.page)) {
//         const start = (page-1) * pagesize
//         connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals,
//                         FullTimeGoalsA AS AwayGoals
//         FROM Matches
//         WHERE HomeTeam LIKE '%${Home}%' and AwayTeam LIKE '%${Away}%'
//         ORDER BY Home, Away
//         LIMIT ${pagesize} OFFSET ${start}`, function (error, results, fields) {

//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });
   
//     } else {
//         // we have implemented this for you to see how to return results by querying the database
//         connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals,
//                         FullTimeGoalsA AS AwayGoals
//         FROM Matches
//         WHERE HomeTeam LIKE '%${Home}%' and AwayTeam LIKE '%${Away}%'
//         ORDER BY Home, Away`, function (error, results, fields) {

//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });
//     }
//     // return res.json({error: "Not implemented"})


// }

// Route 8 (handler)
async function search_players(req, res) {
    const Name = req.query.Name ? req.query.Name : ""
    const Season = req.query.Season ? req.query.Season : 2019
    const Team_name = req.query.Team ? req.query.Team : ""
    const page = req.query.page
    const pagesize = req.query.pagesize ? req.query.pagesize : 10

    if (req.query.page && !isNaN(req.query.page)) {
        const start = (page-1) * pagesize
        connection.query(`
        WITH p AS ( SELECT PLAYER_NAME AS Name, 
            PLAYER_ID, t.NICKNAME AS Team, SEASON AS Season
                    FROM players p
                    JOIN teams t on p.TEAM_ID = t.TEAM_ID
                    WHERE PLAYER_NAME LIKE '%${Name}%' AND t.NICKNAME LIKE '%${Team_name}%' AND SEASON = ${Season}
                    )
        SELECT p.Name, p.PLAYER_ID AS id, p.Team, p.Season, AVG(g.PTS) AS AVG_PTS, AVG(g.AST) AS AVG_AST, AVG(g.REB) AS AVG_REB
        FROM games_details g
        JOIN  p on g.PLAYER_ID = p.PLAYER_ID
        GROUP BY p.SEASON, p.Name, p.Team, p.Season
        ORDER BY p.Name
        LIMIT ${pagesize} OFFSET ${start}`, function (error, results, fields) {
            
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
   
    } else {
        // we have implemented this for you to see how to return results by querying the database
        connection.query(`
        WITH p AS ( SELECT PLAYER_NAME AS Name, PLAYER_ID, t.NICKNAME AS Team, SEASON AS Season
                    FROM players p
                    JOIN teams t on p.TEAM_ID = t.TEAM_ID
                    WHERE PLAYER_NAME LIKE '%${Name}%' AND t.NICKNAME LIKE '%${Team_name}%' AND SEASON = ${Season}
                    )
        SELECT p.Name, p.PLAYER_ID AS id, p.Team, p.Season, AVG(g.PTS) AS AVG_PTS, AVG(g.AST) AS AVG_AST, AVG(g.REB) AS AVG_REB
        FROM games_details g
        JOIN  p on g.PLAYER_ID = p.PLAYER_ID
        GROUP BY p.SEASON, p.Name, p.Team, p.Season
        ORDER BY p.Name`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

module.exports = {
    // hello,
    // jersey,
    // all_matches,
    all_players,
    // match,
    // search_matches,
    search_players,
    player,
    // playerInSeason,
    // playerInLeague,
    games_details,
    // highest_win_players,
    player_in_game,
    top_5_teams,
    player_score_most,
    // player_score_most_in_history,
    all_games,
    all_teams,
    team,
    game,
    team_players,
    teams_conference
}








