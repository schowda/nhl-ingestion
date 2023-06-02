import { WATCHER_API_POLL_INTERVAL } from "../config.js";
import { NHLApi } from "../dependency/nhl.js";
import { GameStatsIngestor } from "./game_stats_ingestor.js";
import { PlayerManager } from "../manager/player_manager.js";
import { sleep } from "../utils.js";

export class GameStatusWatcher {
  nhl: NHLApi;
  playerManager: PlayerManager;

  constructor() {
    this.nhl = new NHLApi();
    this.playerManager = new PlayerManager();
  }

  /**
   * This function will be triggered by cron job for every 5 mins
   * @param gameId 
   */
  async handle(gameId) {
    // Schedule the API polling
    await this.watchStatus(gameId, WATCHER_API_POLL_INTERVAL);
    // ingest static data (player table)
    await this.ingestPlayerData(gameId);
  }

  async ingestPlayerData(gameId: any) {
    const response = await this.nhl.getLiveStatsByGameId(gameId);
    if (!response?.gameData?.players) {
      throw "API reponse doesn't have players information"
    }
    const players = Object.values(response.gameData.players) as Array<any>;
    console.log(`Players count: ${players.length}`);
    // persist player (static) data once before kicking off game stats ingestor
    for (const value of players) {
      await this.playerManager.create({
        id: value.id,
        name: `${value.firstName} ${value.lastName}`,
        number: value.primaryNumber,
        age: value.currentAge,
        position: value.primaryPosition.name,
        teamId: value.currentTeam.id,
      });
    };

    await new GameStatsIngestor().handle(gameId);
  }

  async watchStatus(gameId: number, interval: number) {
    while (true) {
      try {
        const liveData = await this.nhl.getLiveStatsByGameId(gameId)
        const gameStatus = liveData.gameData.status.abstractGameState;
        if (gameStatus === 'Preview') {
          console.log('Game is still in Preview');
        } else {
          console.log('Game is out of Preview!'); // could be Live/Final (for retroactive data)
          break;
        }
      } catch (error) {
        console.error('Error fetching data from the API:', error);
      }
      await sleep(interval);
    }
  };
}