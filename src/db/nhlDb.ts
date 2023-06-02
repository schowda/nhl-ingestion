import { Connection } from "mysql2/promise.js";
import { Player } from "../types/player.js";
import { GamePlayerStats } from "../types/game.js";
import { DB_CONNECTION } from "../config.js";

export class NHLDb {

  connection: Connection;
  constructor() {
    this.connection = DB_CONNECTION;
  }

  async insertOrUpdatePlayer(player: Player) {
    const sqlStatement = `
    INSERT IGNORE INTO Player
    (player_id, player_name, player_age, player_number, player_position, team_id)
    VALUES
    (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    player_name = VALUES(player_name),
    player_age = VALUES(player_age),
    player_number = VALUES(player_number),
    player_position = VALUES(player_position),
    team_id = VALUES(team_id)
  `;
    await this.execute('Player', sqlStatement, [
      player.id,
      player.name,
      player.age,
      Number.parseInt(player.number),
      player.position,
      player.teamId,
    ])
  }

  async insertOrUpdateTeam(team: {
    id: number,
    name: string,
  }) {
    const sqlStatement = `
    INSERT INTO Team
    (team_id, team_name)
    VALUES
    (?, ?)
    ON DUPLICATE KEY UPDATE
    team_name = VALUES(team_name)
  `;
    await this.execute('Team', sqlStatement, [
      team.id,
      team.name,
    ]);
  }

  async insertOrUpdateGame(game: {
    gameId: number,
    seasonId: number,
    scheduledStartTime: Date,
    homeTeamId: number,
    awayTeamId: number,
    venueName: string,
    status: string
  }) {
    const sqlStatement = `
    INSERT INTO Game
    (game_id, season_id, scheduled_start_time, home_team_id, away_team_id, venue_name, status)
    VALUES
    (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    season_id = VALUES(season_id),
    scheduled_start_time = VALUES(scheduled_start_time),
    home_team_id = VALUES(home_team_id),
    away_team_id = VALUES(away_team_id),
    venue_name = VALUES(venue_name),
    status = VALUES(status)
  `;
    await this.execute('Game', sqlStatement, [
      game.gameId,
      game.seasonId,
      game.scheduledStartTime,
      game.homeTeamId,
      game.awayTeamId,
      game.venueName,
      game.status
    ]);
  }

  async insertGamePlayerStats(gameStats: GamePlayerStats) {
    const sqlStatement = `
      INSERT IGNORE INTO GamePlayerStats
      (game_id, player_id, assists, goals, hits, points, penalty_minutes)
      VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `;
    await this.execute('GamePlayerStats', sqlStatement, [
      gameStats.gameId,
      gameStats.playerId,
      gameStats.assists,
      gameStats.goals,
      gameStats.hits,
      gameStats.points,
      gameStats.penaltyMinutes,
    ]);
  }

  close() {
    this.connection.end();
  }

  private async execute(tableName: string, sqlStatement: string, values: any[]) {
    try {
      await this.connection.execute(sqlStatement, values);
      console.debug(`Successfully executed SQL statement on ${tableName} table`);
    } catch (error) {
      console.error(`Failed to execute SQL statement on ${tableName} table`);
      throw error;
    }

  }
}

export default NHLDb;
