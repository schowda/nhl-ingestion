export const GameStatus = {
    PREVIEW: "Preview",
    LIVE: "Live",
    FINAL: "Final"
}

export interface GamePlayerStats {
    gameId: number;
    playerId: number;
    assists: number;
    goals: number;
    hits: number;
    points: number;
    penaltyMinutes: number;
}

export interface Game {
    gameId: number;
    seasonId: number;
    scheduledStartTime: Date;
    status: string;
    homeTeam: {
        id: number;
        name: string;
    };
    awayTeam: {
        id: number;
        name: string;
    };
    venue: string;
}