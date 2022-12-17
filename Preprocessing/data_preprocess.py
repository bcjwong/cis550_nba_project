# -*- coding: utf-8 -*-
"""data_preprocess.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/19Kf1pCLu7kS7WPnCRI3wCH34BH3NwwMQ
"""

ls

cd '/content/drive/Shareddrives/CIS550/NBA stats'

import pandas as pd 
import numpy as np 
games= pd.read_csv('/content/drive/Shareddrives/CIS550/NBA stats/games.csv') 
games.head(5)
games = games.drop(['TEAM_ID_home', 'TEAM_ID_away'], axis =1)
games = games.dropna()
games = games.drop_duplicates(subset='GAME_ID', keep="first")

# games.loc[games['GAME_ID'] == 22000070]

games.to_csv('/content/drive/Shareddrives/CIS550/Processed data/games.csv')

games_details = pd.read_csv("/content/drive/Shareddrives/CIS550/NBA stats/games_details.csv")
games_details['START_POSITION'] = games_details['START_POSITION'].fillna('B')
games_details['COMMENT'] = games_details['COMMENT'].fillna('')
games_details['MIN'] = games_details['MIN'].fillna('')
games_details['MIN']= games_details['MIN'].astype(str)+ games_details['COMMENT'].astype(str)
games_details = games_details.drop(['TEAM_CITY', 'NICKNAME', 'COMMENT'], axis =1 )

games_details = games_details.drop_duplicates(subset=['TEAM_ID','GAME_ID', 'PLAYER_ID'], keep="first")


# some game_details ids not in player id
games_details_complete = games_details[games_details.PLAYER_ID.isin(unique_ids)]
games_details_complete
games_details_complete.to_csv('/content/drive/Shareddrives/CIS550/Processed data/games_details_complete.csv')

# games_details

games_details.to_csv('/content/drive/Shareddrives/CIS550/Processed data/games_details.csv')

player = pd.read_csv('/content/drive/Shareddrives/CIS550/NBA stats/players.csv')
player.head(5)

# player.to_csv('/content/drive/Shareddrives/CIS550/Processed data/players.csv')

unique_ids = pd.unique(player['PLAYER_ID'])
unique_ids

ranking =pd.read_csv("/content/drive/Shareddrives/CIS550/NBA stats/ranking.csv")
ranking.head(5)
ranking.drop(['LEAGUE_ID'], axis =1)
ranking["SEASON_ID"] = ranking["SEASON_ID"].astype(str).str.slice(1, 5)
ranking.head(5)

ranking = ranking.drop_duplicates(subset=['TEAM_ID','SEASON_ID', 'STANDINGSDATE'], keep="first")



# ranking.to_csv('/content/drive/Shareddrives/CIS550/Processed data/ranking.csv')

teams = pd.read_csv("/content/drive/Shareddrives/CIS550/NBA stats/teams.csv")
teams =teams.drop(['LEAGUE_ID','MIN_YEAR','MAX_YEAR','ARENACAPACITY', 'DLEAGUEAFFILIATION'], axis= 1)
teams
# teams.to_csv('/content/drive/Shareddrives/CIS550/Processed data/teams.csv')

