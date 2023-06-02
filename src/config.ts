import { createConnection, createPool } from "mysql2/promise";

export const SEASONS_URL = 'https://statsapi.web.nhl.com/api/v1/seasons';
export const BROADCASTS_URL = 'https://statsapi.web.nhl.com/api/v1/schedule.broadcasts';
export const LIVE_ENDPOINT = 'https://statsapi.web.nhl.com/api/v1/game';
export const DATABASE_CONFIG = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'nhl-database',
};

// INTERVALS in milliseconds

export const WATCHER_API_POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const LIVE_FEED_API_POLL_INTERVAL = 1 * 60 * 1000; // 1 minute


// Singletons
export const DB_CONNECTION = await createConnection(DATABASE_CONFIG);