-- Team table
CREATE TABLE Team (
  team_id INT PRIMARY KEY,
  team_name VARCHAR(100)
);

-- Player table
CREATE TABLE Player (
  player_id INT PRIMARY KEY,
  player_name VARCHAR(100),
  player_age INT,
  player_number INT,
  player_position VARCHAR(100),
  team_id INT,
  FOREIGN KEY (team_id) REFERENCES Team (team_id)
);

-- Game table
CREATE TABLE Game (
  game_id INT PRIMARY KEY,
  season_id INT,
  scheduled_start_time DATETIME,
  home_team_id INT,
  away_team_id INT,
  venue_name VARCHAR(100),
  status VARCHAR(50),
  FOREIGN KEY (away_team_id) REFERENCES Team (team_id),
  FOREIGN KEY (home_team_id) REFERENCES Team (team_id)
);

-- GamePlayerStats table
CREATE TABLE GamePlayerStats (
  game_id INT,
  player_id INT,
  assists INT,
  goals INT,
  hits INT,
  points INT,
  penalty_minutes INT,
  PRIMARY KEY (game_id, player_id),
  FOREIGN KEY (game_id) REFERENCES Game (game_id),
  FOREIGN KEY (player_id) REFERENCES Player (player_id)
);
