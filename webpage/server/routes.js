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

    connection.query(`
    SELECT * FROM players
    WHERE PLAYER_ID = ${id}
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

async function playerInSeason(req, res){
    const season = req.params.season ? req.params.season : 2021

    connection.query(`
    Select * from players 
    where season=${season}
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


async function playerInLeague(req, res){
    const league = req.query.league
    const position = req.query.position

    connection.query(`
    With team_league as (
        Select team_id from ranking
        Where league_id=${league}
    )
    Select player_id, player_name from games_details
    Where team_id in (select team_id from team_league)
    And start_position=${position}
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

/* TEAM PAGE */
// async function players_in_team(req, res){
//     const team_name = req.query.team_name
//     connection.query(`SELECT DISTINCT PLAYER_NAME FROM players P
//     JOIN teams T ON P.Team_ID = T.Team_ID
//     WHERE T.Nickname =  ${team_name};        
//     `, function (error, results, fields) {

//         if (error) {
//             console.log(error)
//             res.json({ error: error })
//         } else if (results) {
//             res.json({ results: results })
//         }
//     });
// }

//---
/* PLAYER PAGE */
async function highest_win_players(req, res){
    connection.query(`SELECT DISTINCT T.Team_id, T.Nickname, R.W_PCT, R.Season_ID FROM teams T
    JOIN ranking R ON T.TEAM_ID = R.TEAM_ID
    WHERE G IN (SELECT MAX(G) FROM ranking)
    ORDER BY R.W_PCT DESC
    LIMIT 10;
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
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
async function top_8_teams(req, res){
    connection.query(`WITH TEMP AS (
   SELECT season_id, team, MAX(G) as G, MAX(W) as W, MAX(L) as L FROM ranking
   GROUP BY season_id, team
   )
   Select * from (
       SELECT season_id, team, G, W, L, dense_rank() over (PARTITION BY Season_Id, team ORDER by G) as rk
   from TEMP) a Where rk <= 8;
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

/* PLAYER PAGE */
// find the top 10 players who assist and score the most in history(this dataset)
async function player_score_most_in_history(req, res){
    connection.query(`with cte as (select PLAYER_ID, sum(AST) as total_ast
    from games_details
    group by PLAYER_ID
    order by sum(AST) DESC),
        cte1 as (select PLAYER_ID, sum(PTS) as total_ast
    from games_details
    group by PLAYER_ID
    order by sum(PTS) DESC)
    
    select cte.PLAYER_ID from cte
    join cte1 on cte.PLAYER_ID = cte1.PLAYER_ID
    LIMIT 10;
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}





// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function hello(req, res) {
    // a GET request to /hello?name=Steve
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the NBA server!`)
    } else {
        res.send(`Hello! Welcome to the NBA server!`)
    }
}


// ********************************************
//                  WARM UP 
// ********************************************

// Route 2 (handler)
async function jersey(req, res) {
    const colors = ['red', 'blue', 'white']
    const jersey_number = Math.floor(Math.random() * 20) + 1
    const name = req.query.name ? req.query.name : "player"

    if (req.params.choice === 'number') {
        // TODO: TASK 1: inspect for issues and correct 
        res.json({ message: `Hello, ${name}!`, jersey_number: jersey_number })
    } else if (req.params.choice === 'color') {
        var lucky_color_index = Math.floor(Math.random() * 2);
        // TODO: TASK 2: change this or any variables above to return only 'red' or 'blue' at random (go Quakers!)
        res.json({ message: `Hello, ${name}!`, jersey_color: colors[lucky_color_index] })
    } else {
        // TODO: TASK 3: inspect for issues and correct
        res.json({ message: `Hello, ${name}, we like your jersey!` })
    }
    
}


// ********************************************
//               GENERAL ROUTES
// ********************************************


// Route 3 (handler)
async function all_matches(req, res) {
    const league = req.params.league ? req.params.league : 'D1'
    const page = req.query.page
    const pagesize = req.query.pagesize ? req.query.pagesize : 10
    // use this league encoding in your query to furnish the correct results

    if (req.query.page && !isNaN(req.query.page)) {
        // This is the case where page is defined.
        // The SQL schema has the attribute OverallRating, but modify it to match spec! 
        // TODO: query and return results here:
        const start = (page-1) * pagesize
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
        FROM Matches 
        WHERE Division = '${league}'
        ORDER BY HomeTeam, AwayTeam
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
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
        FROM Matches 
        WHERE Division = '${league}'
        ORDER BY HomeTeam, AwayTeam`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Route 4 (handler)
async function all_players(req, res) {
    const season = req.query.season

    connection.query(`Select * from Players where season=${season} `, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });

    // // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests
    // const page = req.query.page
    // const pagesize = req.query.pagesize ? req.query.pagesize : 10
    // // use this league encoding in your query to furnish the correct results

    // if (req.query.page && !isNaN(req.query.page)) {
    //     // This is the case where page is defined.
    //     // The SQL schema has the attribute OverallRating, but modify it to match spec! 
    //     // TODO: query and return results here:
    //     const start = (page-1) * pagesize
    //     connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
    //     FROM Players 
    //     ORDER BY Name
    //     LIMIT ${pagesize} OFFSET ${start}`, function (error, results, fields) {

    //         if (error) {
    //             console.log(error)
    //             res.json({ error: error })
    //         } else if (results) {
    //             res.json({ results: results })
    //         }
    //     });
   
    // } else {
        // // we have implemented this for you to see how to return results by querying the database
        // connection.query(`SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value
        // FROM Players 
        // ORDER BY Name`, function (error, results, fields) {

        //     if (error) {
        //         console.log(error)
        //         res.json({ error: error })
        //     } else if (results) {
        //         res.json({ results: results })
        //     }
        // });
    // }

    // return res.json({error: "Not implemented"})
}


// ********************************************
//             MATCH-SPECIFIC ROUTES
// ********************************************

// Route 5 (handler)
async function match(req, res) {
    // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests
    const id = req.query.id
    
    // This is the case where page is defined.
    // The SQL schema has the attribute OverallRating, but modify it to match spec! 
    // TODO: query and return results here:
    connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, 
                    FullTimeGoalsA AS AwayGoals, HalfTimeGoalsH AS HTHomeGoals, HalfTimeGoalsA AS HTAwayGoals,
                    ShotsH AS ShotsHome, ShotsA AS ShotsAway, ShotsOnTargetH AS ShotsOnTargetHome, ShotsOnTargetA AS ShotsOnTargetAway,
                    FoulsH AS FoulsHome, FoulsA AS FoulsAway, CornersH AS CornersHome, CornersA AS CornersAway, YellowCardsH AS YCHome,
                    YellowCardsA AS YCAway, RedCardsH AS RCHome, RedCardsA AS RCAway
    FROM Matches
    WHERE MatchId = ${id}`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    });
   
    // return res.json({error: "Not implemented"})
}

// ********************************************
//            PLAYER-SPECIFIC ROUTES
// ********************************************

// // Route 6 (handler)
// async function player(req, res) {
//     // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests
//     // const id = req.query.id
//     const name = req.query.name

//     connection.query(`Select * from Players where Player_name=${name}`, function (error, results, fields) {

//             if (error) {
//                 console.log(error)
//                 res.json({ error: error })
//             } else if (results) {
//                 res.json({ results: results })
//             }
//         });
    // This is the case where page is defined.
    // The SQL schema has the attribute OverallRating, but modify it to match spec! 
    // TODO: query and return results here:
    // connection.query(`SELECT BestPosition
    // FROM Players
    // WHERE PlayerId = ${id}`, function (error, results, fields) {
    //     if (error) {
    //         console.log(error)
    //         res.json({ error: error })
    //     } else if (results[0].BestPosition == "GK") {
    //         connection.query(`SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club,
    //                         ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height,
    //                         Weight, BestPosition, BestOverallRating, ReleaseClause, GKPenalties, GKDiving, GKHandling, GKKicking,
    //                         GKPositioning, GKReflexes
    //         FROM Players
    //         WHERE PlayerId = ${id}`, function (error, results, fields) {

    //             if (error) {
    //                 console.log(error)
    //                 res.json({ error: error })
    //             } else if (results) {
    //                 res.json({ results: results })
    //             }
    //         })
    //     } else if (results){
    //         connection.query(`SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club,
    //                         ClubLogo, Value, Wage, InternationalReputation, Skill, JerseyNumber, ContractValidUntil, Height,
    //                         Weight, BestPosition, BestOverallRating, ReleaseClause, NPassing, NBallControl, NAdjustedAgility, 
    //                         NStamina, NStrength, NPositioning
    //         FROM Players
    //         WHERE PlayerId = ${id}`, function (error, results, fields) {

    //             if (error) {
    //                 console.log(error)
    //                 res.json({ error: error })
    //             } else if (results) {
    //                 res.json({ results: results })
    //             }
    //         })
    //     }
    // });

    // return res.json({error: "Not implemented"})
// }


// ********************************************
//             SEARCH ROUTES
// ********************************************

// Route 7 (handler)
async function search_matches(req, res) {
    // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
    // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
    const Home = req.query.Home ? req.query.Home : ""
    const Away = req.query.Away ? req.query.Away : ""
    const page = req.query.page
    const pagesize = req.query.pagesize ? req.query.pagesize : 10

    if (req.query.page && !isNaN(req.query.page)) {
        const start = (page-1) * pagesize
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals,
                        FullTimeGoalsA AS AwayGoals
        FROM Matches
        WHERE HomeTeam LIKE '%${Home}%' and AwayTeam LIKE '%${Away}%'
        ORDER BY Home, Away
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
        connection.query(`SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals,
                        FullTimeGoalsA AS AwayGoals
        FROM Matches
        WHERE HomeTeam LIKE '%${Home}%' and AwayTeam LIKE '%${Away}%'
        ORDER BY Home, Away`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
    // return res.json({error: "Not implemented"})


}

// Route 8 (handler)
async function search_players(req, res) {
    const Name = req.query.Name ? req.query.Name : ""
    const Season = req.query.Season ? req.query.Season : 2019
    const Team_name = req.query.Team ? req.query.Team : ""
    const page = req.query.page
    const pagesize = req.query.pagesize ? req.query.pagesize : 10

    if (req.query.page && !isNaN(req.query.page)) {
        const start = (page-1) * pagesize
        /* 
        This part may need some modification!
        
        */
        connection.query(`
        WITH p AS ( SELECT PLAYER_NAME AS Name, PLAYER_ID, t.NICKNAME AS Team, SEASON AS Season
                    FROM players p
                    JOIN teams t on p.TEAM_ID = t.TEAM_ID
                    WHERE PLAYER_NAME LIKE '%${Name}%' AND t.NICKNAME LIKE '%${Team_name}%' AND SEASON = ${Season}
                    )
        SELECT p.Name, p.Team, p.Season, AVG(g.PTS) AS AVG_PTS, AVG(g.AST) AS AVG_AST, AVG(g.REB) AS AVG_REB
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
        SELECT p.Name, p.Team, p.Season, AVG(g.PTS) AS AVG_PTS, AVG(g.AST) AS AVG_AST, AVG(g.REB) AS AVG_REB
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
    hello,
    jersey,
    all_matches,
    all_players,
    match,
    search_matches,
    search_players,
    player,
    playerInSeason,
    playerInLeague,
    games_details,
    highest_win_players,
    player_in_game,
    top_8_teams,
    player_score_most,
    player_score_most_in_history,
    all_games,
    all_teams,
    team,
    game,
    team_players,
    teams_conference
}









