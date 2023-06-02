import { GameDataIngestionScheduler } from "./handler/game_data_ingestion_scheduler.js";
import { GameStatusWatcher } from "./handler/game_status_watcher.js";

// Calls handle method of the GameDataIngestionScheduler with the today's date
const gameDataIngestionScheduler = new GameDataIngestionScheduler();
const today = new Date().toISOString().split('T')[0]; 
const customDate = '2023-05-25' // Use customDate for reloading retroactive data of past Games
await gameDataIngestionScheduler.handle(today);


// Hardcoded to watch and trigger GameStats Ingestion (LOCAL TESTING)
const watcher = new GameStatusWatcher();
await watcher.handle(2022030324); 
process.exit(0);