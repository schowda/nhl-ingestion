### Instructions to run the app

#### Pre-req:
* Install Docker
* Install Node V18.0+


### Steps
* Start MYSQL server using docker

```
docker pull mysql

docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 mysql
```

* Using any MYSQL client eg. MYSQL Workbench 
    * Create a database with name `nhl-database`
    * Create tables using script ./src/db/nhl-schema.sql

* `npm install`

* `npm start`

Notes: 

1. The `index.ts` file has two processes:
    1. Runs a scheudled job once a day (eg. cron job at 3 AM) to fetch game schedules for that day (could potentially create an event for game status watcher to trigger see `./src/manager/event_manager.ts`)
    1. Runs Game status watcher process with a hardcoded gameId (for the purpose of demonstrating the functionality) which watches for the status changes and triggers game stats ingestion process
1. The GameStatusWatcher is implemented in a way to watch and load live and final (retroactive) games
