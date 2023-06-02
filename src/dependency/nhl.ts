import fetch from "node-fetch";
import { LIVE_ENDPOINT } from "../config.js";

const BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

export class NHLApi {
    async getScheduleByDate(date: string) {
        const scheduleUrl = `${BASE_URL}/schedule?date=${date}`;
        const scheduleResponse = await fetch(scheduleUrl);
        const scheduleData: any = await scheduleResponse.json();
        return scheduleData;
    }

    async getLiveStatsByGameId(gameId: number) {
        const liveUrl = `${LIVE_ENDPOINT}/${gameId}/feed/live`;
        const liveResponse = await fetch(liveUrl);
        const liveData: any = await liveResponse.json();
        return liveData; 
    }

}