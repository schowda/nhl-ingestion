import NHLDb from "../db/nhlDb.js";
import { Player } from "../types/player.js";
import { sleep } from "../utils.js";

export class PlayerManager {
    db: NHLDb;

    constructor() {
        this.db = new NHLDb();
    }

    async create(player: Player) {
        // create player
        await this.db.insertOrUpdatePlayer(player);
    }
}