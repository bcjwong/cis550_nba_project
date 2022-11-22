USE NBA_DATA;

# Teams
CREATE TABLE teams(
    TEAM_ID varchar(12),
    ABBREVIATION varchar(5),
    NICKNAME varchar(25),
    YEARFOUNDED varchar(4),
    CITY varchar(25),
    ARENA varchar(50),
    OWNER varchar(25),
    GENERALMANAGER varchar(25),
    HEADCOACH varchar(25),
    PRIMARY KEY (TEAM_ID)
);


# player
CREATE TABLE player(PLAYER_NAME varchar(20), TEAM_ID varchar(12), PLAYER_ID varchar(20), SEASON varchar(20),
PRIMARY KEY(PLAYER_ID, TEAM_ID, SEASON),
FOREIGN KEY (TEAM_ID) REFERENCES teams(TEAM_ID));


# games
CREATE TABLE games(
    GAME_DATE_EST varchar(11),
    GAME_ID varchar(10),
    GAME_STATUS_TEXT varchar(10),
    HOME_TEAM_ID varchar(10),
    VISITOR_TEAM_ID varchar(10),
    SEASON varchar(5),
    PTS_home varchar(4),
    FG_PCT_home varchar(7),
    FT_PCT_home varchar(7),
    FG3_PCT_home varchar(7),
    AST_home varchar(5),
    REB_home varchar(5),
    PTS_away varchar(5),
    FG_PCT_away varchar(7),
    FT_PCT_away varchar(7),
    FG3_PCT_away varchar(7),
    AST_away varchar(5),
    REB_away varchar(5),
    HOME_TEAM_WINS varchar(1),
    PRIMARY KEY (GAME_ID),
    FOREIGN KEY (HOME_TEAM_ID) REFERENCES teams(TEAM_ID),
    FOREIGN KEY (VISITOR_TEAM_ID) REFERENCES teams(TEAM_ID)
);

# Ranking
CREATE TABLE ranking(
    TEAM_ID varchar(12),
    LEAGUE_ID varchar(1),
    SEASON_ID varchar(4),
    STANDINGSDATE varchar(10),
    CONFERENCE varchar(10),
    TEAM varchar(20),
    G int,
    W int,
    L int,
    W_PCT varchar(7),
    HOME_RECORD varchar(7),
    ROAD_RECORD varchar(7),
    RETURNTOPLAY varchar(5),
    PRIMARY KEY (TEAM_ID, SEASON_ID, STANDINGSDATE),
    FOREIGN KEY (TEAM_ID) REFERENCES teams(TEAM_ID)
);

# games details
CREATE TABLE games_details(GAME_ID varchar(12), TEAM_ID varchar(10), TEAM_ABBREVIATION varchar(5), PLAYER_ID varchar(20),
PLAYER_NAME varchar(50), START_POSITION	varchar(1), MIN varchar(50), FGM decimal(3,1), FGA decimal(3,1), FG_PCT decimal(4,3),
FG3M decimal(3,1), FG3A decimal(3,1), FG3_PCT decimal(4,3), FTM decimal(3,1), FTA decimal(3,1), FT_PCT decimal(4,3), OREB int,
DREB int,REB int, AST int,	STL int, BLK int, T_O int, PF int, PTS int, PLUS_MINUS int,
FOREIGN KEY (TEAM_ID) REFERENCES teams(TEAM_ID), FOREIGN KEY (GAME_ID) REFERENCES games(GAME_ID)
);



with cte as (select PLAYER_ID, sum(AST) as total_ast
from games_details
group by PLAYER_ID
order by sum(AST) DESC limit 10),
    cte1 as (select PLAYER_ID, sum(PTS) as total_ast
from games_details
group by PLAYER_ID
order by sum(PTS) DESC limit 10)

select cte.PLAYER_ID from cte
join cte1 on cte.PLAYER_ID = cte1.PLAYER_ID;




WITH TEMP AS (
   SELECT season_id, team, MAX(G) as G, MAX(W) as W, MAX(L) as L FROM ranking
   GROUP BY season_id, team
   )
   Select * from (
       SELECT season_id, team, G, W, L, dense_rank() over (PARTITION BY Season_Id, team ORDER by G) as rk
   from TEMP) a
Where rk <= 8



