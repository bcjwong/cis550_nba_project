# Importing Data

## Directories

**/Dataset**
This folder contains all the dataset required to query the NBA information

**Instructions.md**

**/Preprocessing**
This folder contains the python code to preprocess the datasets and the SQL DDL statements to upload to MySQL database

**README.md**

**/Webpage**
This folder contains the code for this project
- **/server**
    - This folder contains all the code and dependencies to run the server side of the code
    - Contains the SQL code to query the database
- **/client**
    - This folder contains all the UI elements and code to intereface between server and client



## Getting Started
Make sure to import all npm and node modules as listed in the files: [package.json and package-lock.json], and make sure to have the config.json information set up correctly.
Run the datasets through the pre-processing pipeline in the pre_process.py file under /Preprocessing.  


## DDL Statements

```sql
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

# Games Details complete
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
```

## Importing CSVs into RDS

Using the DataGrip import wizard, import games.csv into the games table, players.csv into the players table, ranking.csv into the ranking table, games_details_complete.csv into the games_details table, teams.csv into teams table

## Starting up the project locally
**Server**
- cd into the server folder
- make sure npm version is 8.19.2
- run "npm start"

**Client**
- cd into client folder
- make sure npm version is 6.14.13
- make sure nvm is version 14.17.1 by running "nvm use 14.17.1"
- run "npm start"


**When importing the files, ensure that the `First row is header` option is checked, or you will run into errors** 