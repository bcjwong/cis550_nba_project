CREATE DATABASE NBA;
USE NBA_DATA;

# Teams
CREATE TABLE teams(
    TEAM_ID int,
    ABBREVIATION varchar(5),
    NICKNAME varchar(25),
    YEARFOUNDED varchar(4),
    CITY varchar(25),
    ARENA varchar(50),
    OWNER varchar(25),
    GENERALMANAGER varchar(25),
    HEADCOACH varchar(25),
    CURRENT_PLAYER_1 varchar(25),
    CURRENT_PLAYER_2 varchar(25),
    CURRENT_PLAYER_3 varchar(25),
    CURRENT_PLAYER_4 varchar(25),
    CURRENT_PLAYER_5 varchar(25),
    CURRENT_PLAYER_6 varchar(25),
    CURRENT_PLAYER_7 varchar(25),
    CURRENT_PLAYER_8 varchar(25),
    CURRENT_PLAYER_9 varchar(25),
    CURRENT_PLAYER_10 varchar(25),
    CURRENT_PLAYER_11 varchar(25),
    CURRENT_PLAYER_12 varchar(25),
    CURRENT_PLAYER_13 varchar(25),
    CURRENT_PLAYER_14 varchar(25),
    CURRENT_PLAYER_15 varchar(25),
    CURRENT_PLAYER_16 varchar(25),
    CURRENT_PLAYER_17 varchar(25),
    CURRENT_PLAYER_18 varchar(25),
    CONFERENCE varchar(10),
    DISTRICT varchar(15),
    LOGO varchar(256),
    CONFERENCE_LOGO varchar(256),
    PRIMARY KEY (TEAM_ID)
);

# Player
CREATE TABLE players(
    PLAYER_NAME varchar(50),
    TEAM_ID int,
    PLAYER_ID int,
    SEASON int,
PRIMARY KEY(PLAYER_ID, TEAM_ID, SEASON),
FOREIGN KEY (TEAM_ID) REFERENCES teams(TEAM_ID));


# Games
CREATE TABLE games(
    GAME_DATE_EST DATE,
    GAME_ID int,
    GAME_STATUS_TEXT varchar(10),
    HOME_TEAM_ID int,
    VISITOR_TEAM_ID int,
    SEASON int,
    PTS_home int,
    FG_PCT_home decimal(4, 3),
    FT_PCT_home decimal(4, 3),
    FG3_PCT_home decimal(4, 3),
    AST_home int,
    REB_home int,
    PTS_away int,
    FG_PCT_away decimal(4, 3),
    FT_PCT_away decimal(4, 3),
    FG3_PCT_away decimal(4, 3),
    AST_away int,
    REB_away int,
    HOME_TEAM_WINS int,
    PRIMARY KEY (GAME_ID),
    FOREIGN KEY (HOME_TEAM_ID) REFERENCES teams(TEAM_ID),
    FOREIGN KEY (VISITOR_TEAM_ID) REFERENCES teams(TEAM_ID)
);

SELECT game_date_est, t.NICKNAME as HOME_TEAM, PTS_home, p.NICKNAME as VISITOR_TEAM_ID, PTS_away
from games
join teams t on games.HOME_TEAM_ID = t.TEAM_ID
join teams p on games.VISITOR_TEAM_ID = p.TEAM_ID
ORDER BY GAME_DATE_EST DESC;


# Ranking
CREATE TABLE ranking(
    TEAM_ID int,
    LEAGUE_ID int,
    SEASON_ID int,
    STANDINGSDATE date,
    CONFERENCE varchar(10),
    TEAM varchar(20),
    G int,
    W int,
    L int,
    W_PCT decimal(4, 3),
    HOME_RECORD varchar(7),
    ROAD_RECORD varchar(7),
    RETURNTOPLAY varchar(5),
    PRIMARY KEY (TEAM_ID, SEASON_ID, STANDINGSDATE),
    FOREIGN KEY (TEAM_ID) REFERENCES teams(TEAM_ID)
);

# games details complete
CREATE TABLE games_details(
    GAME_ID int,
    TEAM_ID int,
    TEAM_ABBREVIATION varchar(5),
    PLAYER_ID int,
    PLAYER_NAME varchar(50),
    START_POSITION	varchar(1),
    MIN varchar(50),
    FGM int,
    FGA int,
    FG_PCT decimal(4,3),
    FG3M int,
    FG3A int,
    FG3_PCT decimal(4,3),
    FTM int,
    FTA int,
    FT_PCT decimal(4,3),
    OREB int,
    DREB int,
    REB int,
    AST int,
    STL int,
    BLK int,
    T_O int,
    PF int,
    PTS int,
    PLUS_MINUS int,
    FOREIGN KEY (TEAM_ID) REFERENCES teams(TEAM_ID),
    FOREIGN KEY (GAME_ID) REFERENCES games(GAME_ID),
    FOREIGN KEY (PLAYER_ID) REFERENCES players(PLAYER_ID)
);


