import { LIVE_FEED_API_POLL_INTERVAL } from "../config.js";
import { NHLApi } from "../dependency/nhl.js";
import { GameManager } from "../manager/game_manager.js";
import { GameStatus } from "../types/game.js";
import { sleep } from "../utils.js";

export class GameStatsIngestor {
    nhl: NHLApi;
    gameManager: GameManager;

    constructor() {
        this.nhl = new NHLApi();
        this.gameManager = new GameManager();
    }
    async handle(gameId: number) {
        while (true) {
            const gameStatsData = await this.nhl.getLiveStatsByGameId(gameId);
            const status = gameStatsData.gameData.status.abstractGameState;
            if (!status || status === GameStatus.PREVIEW) {
                throw `Game Id = ${gameId} hasn't started yet!`
            }
            // home team stats
            await this.updateGameStats(gameId, gameStatsData?.liveData?.boxscore?.teams?.home?.players);
            // away team stats
            await this.updateGameStats(gameId, gameStatsData?.liveData?.boxscore?.teams?.away?.players);

            // terminate if game status is final
            if (status === GameStatus.FINAL) {
                break;
            } else {
                await sleep(LIVE_FEED_API_POLL_INTERVAL);
            }
        }
    }
    private async updateGameStats(gameId: number, players: any) {
        if (!players) {
            throw "Players information is not present in the API response";
        }

        for (const player of Object.values(players) as Array<any>) {
            const skaterStats = player.stats.skaterStats;
            await this.gameManager.createPlayerStats({
                gameId: gameId,
                playerId: player.person.id,
                assists: skaterStats?.assists || 0,
                goals: skaterStats?.goals || 0,
                hits: skaterStats?.hits || 0,
                penaltyMinutes: skaterStats?.penaltyMinutes || 0,
                points: skaterStats?.point || 0,
            });
        }
    }
}