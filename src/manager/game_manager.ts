import NHLDb from "../db/nhlDb.js";
import { Game, GamePlayerStats } from "../types/game.js";



export class GameManager {
    db: NHLDb;

    constructor() {
        this.db = new NHLDb();
    }
    async create(game: Game) {
        try {
            // create home team
            await this.db.insertOrUpdateTeam(game.homeTeam);
            // create away team
            await this.db.insertOrUpdateTeam(game.awayTeam);
            // create game
            await this.db.insertOrUpdateGame({
                ...game,
                venueName: game.venue,
                homeTeamId: game.homeTeam.id,
                awayTeamId: game.awayTeam.id,
            })
        } catch (error) {
            console.error("Failed to create game");
            throw error;
        }
    }

    async createPlayerStats(stats: GamePlayerStats) {
       await this.db.insertGamePlayerStats(stats);
    }

}