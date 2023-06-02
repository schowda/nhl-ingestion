
export class EventManager {
    createStatusWatcherEvent(event: { time: Date; gameId: number; }) {
        // skiping for now, for short-term solution
        /**
         * short-term: hardcoding gameId in the index.ts file
         * 
         * long-term: create a event using event scheduler systems like AWS Cloudwatch Eventbridge, which will be responsible for triggering GameStatusWatcher
         */
    }

}