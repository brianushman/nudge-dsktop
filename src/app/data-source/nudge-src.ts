import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as moment from 'moment';
import * as uuid from 'uuid';
import { NudgeTracker } from '../models/nudge-tracker';
import { Observable } from 'rxjs/internal/Observable';
import { TrackerType } from '../models/TrackerTypeEnum';

export class NudgeSource {

    baseUrl:string = 'https://api.nudgeyourself.com';
    http:HttpClient;

    constructor(http:HttpClient){ this.http = http; }

    cookie:string = 'eyJpdiI6InpYejFjaG9JZWJlZlJJZmJNUnBlZ2c9PSIsInZhbHVlIjoiSVdxK1p2ZVwvazlleHlFQVkydTVIU3pFZHhZZ3NwNTdlWklVRTRmWnU1SmE3N1ZtN3ZrXC9sUkxpRlwvZXZqVmtzc0ZYd3lXUWRJZEN0aHRxZkRCUThSVHc9PSIsIm1hYyI6IjRjNjdlODc0YzBkZGI3MmNjZTk4NzBiMjEyZDFlY2Y1YmY1NjIwNmM2NGNhZTFjNDEwZjhmNWU3MTY4NjIzOTYifQ%3D%3D';
    
    public getData(date:Date):Observable<NudgeTracker[]> {
        const dateStr:string = moment(date).format('YYYY-MM-DD');

        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", "a0fcad7865c76a4f4428c06a8699afcb")
            .set("x-api-key", "1ccb73d4c689414294cf951fd29a4eee5cdc8770")
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")
            .set("Set-Cookie", `laravel_session=${this.cookie}`)

        return this.http.get<NudgeTracker[]>(this.baseUrl + `/5/users/188407/trackers?log_date_from=${dateStr}&log_date_to=${dateStr}`, {headers});
    }
    
    public updateTracker(tracker:NudgeTracker, trackerType: TrackerType, notes:string, quantity:number = null) {
        var timestamp = moment();
        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", "a0fcad7865c76a4f4428c06a8699afcb")
            .set("x-api-key", "1ccb73d4c689414294cf951fd29a4eee5cdc8770")
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")
            .set("Set-Cookie", `laravel_session=${this.cookie}`)

        let data:IHttpPostTracker = {
            id: uuid.v4(),
            serverId: null,
            trackerId: tracker.id,
            trackerType: "custom-question",
            source: "nudge",
            via: null,
            userTime: timestamp.format('YYYY-MM-DDTHH:mm:ss') + '.000Z',
            isUntimedActivity: false,
            notes: trackerType == TrackerType.Counter ? notes : null,
            distance: null,
            duration: null,
            hiDuration: null,
            quantity: quantity,
            bloodGlucose: null,
            systolic: null,
            diastolic: null,
            calories: null,
            carbohydrates: null,
            fat: null,
            fiber: null,
            protein: null,
            sodium: null,
            fatRatio: null,
            weight: null,
            response: trackerType == TrackerType.Question ? notes : null,
            activityId: null,
            isCrossedOut: false,
            users_id: tracker.user.id,
            user_time: timestamp.format('YYYY-MM-DD HH:mm:ss'),
            hi_duration: null,
            fat_ratio: null,
            blood_glucose: null,
            activity_id: null
        }

        if(tracker.user.logs.length == 0) {
            return this.http.post(this.baseUrl + `/5/trackers/${tracker.id.toString()}/logs`, data, {headers});
        }
        else {
            data.id = tracker.user.logs[0].id.toString();
            data.serverId = tracker.user.logs[0].id;
            return this.http.put<NudgeTracker[]>(this.baseUrl + `/5/trackers/${tracker.id.toString()}/logs/${data.id}`, data, {headers});
        }
    }

}