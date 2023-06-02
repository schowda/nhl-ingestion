import { NHLApi } from '../dependency/nhl.js';
import { GameManager } from '../manager/game_manager.js';
import { EventManager } from '../manager/event_manager.js';

export class GameDataIngestionScheduler {
  seasonsUrl: any;
  broadcastsUrl: any;
  liveEndpoint: any;
  databaseConfig: any;
  nhl: NHLApi;
  gameManager: GameManager;
  eventManager: EventManager;
  constructor() {
    this.nhl = new NHLApi();
    this.gameManager = new GameManager();
    this.eventManager = new EventManager();
  }

  async handle(date) {
    try {
      const scheduleData = await this.nhl.getScheduleByDate(date);
      if (scheduleData.dates.length === 0) {
        console.log('No games scheduled for today.');
        return;
      }
      for (const game of scheduleData.dates[0].games) {
        const gameId = game.gamePk;
        const gameDate = game.gameDate;
        const scheduledStartTime = new Date(gameDate);
        const thirtyMinutesBeforeStartTime = new Date(scheduledStartTime.getTime() - 30 * 60000);

        await this.gameManager.create({
          gameId: game.gamePk,
          seasonId: game.season,
          scheduledStartTime: scheduledStartTime,
          homeTeam: {
            id: game.teams.home.team.id,
            name: game.teams.home.team.name,
          },
          awayTeam: {
            id: game.teams.away.team.id,
            name: game.teams.away.team.name
          },
          venue: game.venue.name,
          status: game.status.abstractGameState,
        });

        await this.eventManager.createStatusWatcherEvent({
          time: thirtyMinutesBeforeStartTime,
          gameId,
        });
      }
    } catch (error) {
      console.error('Error scheduling game ingestion:', error);
    }

  }

}