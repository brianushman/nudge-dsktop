import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as moment from 'moment';
import * as uuid from 'uuid';
import { NudgeTracker, NudgeUserDataLog } from '../models/nudge-tracker';
import { Observable } from 'rxjs/internal/Observable';
import { TrackerType } from '../models/TrackerTypeEnum';
import { CookieService } from 'ngx-cookie-service';

export class NudgeSource {

    baseUrl:string = 'https://api.nudgeyourself.com';
    apiKey:string;
    apiToken:string;
    http:HttpClient;

    constructor(http:HttpClient, cookieService:CookieService){
        this.http = http;
        this.apiKey = cookieService.get('nudge-api-key');
        this.apiToken = cookieService.get('nudge-api-token');
    }

    public getData(date:Date):Observable<NudgeTracker[]> {
        const dateStr:string = moment(date).format('YYYY-MM-DD');

        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", this.apiToken)
            .set("x-api-key", this.apiKey)
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")

        return this.http.get<NudgeTracker[]>(this.baseUrl + `/5/users/188407/trackers?log_date_from=${dateStr}&log_date_to=${dateStr}`, {headers});
    }

    public createTrackerCounter(tracker:NudgeTracker, quantity:number):Observable<NudgeUserDataLog> {
        var timestamp = moment();
        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", this.apiToken)
            .set("x-api-key", this.apiKey)
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")

        let data:IHttpPostTracker = {
            id: uuid.v4(),
            serverId: null,
            trackerId: tracker.id,
            trackerType: TrackerType.Counter,
            source: "nudge",
            via: null,
            userTime: timestamp.format('YYYY-MM-DDTHH:mm:ss') + '.000Z',
            isUntimedActivity: false,
            notes: null,
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
            response: null,
            activityId: null,
            isCrossedOut: false,
            users_id: tracker.user.id,
            user_time: timestamp.format('YYYY-MM-DD HH:mm:ss'),
            hi_duration: null,
            fat_ratio: null,
            blood_glucose: null,
            activity_id: null
        }

        return this.http.post<NudgeUserDataLog>(this.baseUrl + `/5/trackers/${tracker.id.toString()}/logs`, data, {headers});
    }

    public updateTrackerCounter(tracker:NudgeTracker, log:NudgeUserDataLog):Observable<NudgeUserDataLog> {
        var timestamp = moment();
        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", this.apiToken)
            .set("x-api-key", this.apiKey)
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")

        let data:IHttpPostTracker = {
            id: tracker.user.logs[0].id.toString(),
            serverId: tracker.user.logs[0].id,
            trackerId: tracker.id,
            trackerType: TrackerType.Counter,
            source: "nudge",
            via: null,
            userTime: moment(log.user_time).format('YYYY-MM-DDTHH:mm:ss') + '.000Z',
            isUntimedActivity: false,
            notes: log.notes,
            distance: null,
            duration: null,
            hiDuration: null,
            quantity: log.quantity,
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
            response: null,
            activityId: null,
            isCrossedOut: false,
            users_id: tracker.user.id,
            user_time: moment(log.user_time).format('YYYY-MM-DD HH:mm:ss'),
            hi_duration: null,
            fat_ratio: null,
            blood_glucose: null,
            activity_id: null
        }

        return this.http.put<NudgeUserDataLog>(this.baseUrl + `/5/trackers/${tracker.id.toString()}/logs/${data.id}`, data, {headers});
    }
    
    public updateTrackerQuestion(tracker:NudgeTracker, notes:string):Observable<NudgeUserDataLog> {
        var timestamp = moment();
        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", this.apiToken)
            .set("x-api-key", this.apiKey)
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")

        let data:IHttpPostTracker = {
            id: uuid.v4(),
            serverId: null,
            trackerId: tracker.id,
            trackerType: TrackerType.Question,
            source: "nudge",
            via: null,
            userTime: timestamp.format('YYYY-MM-DDTHH:mm:ss') + '.000Z',
            isUntimedActivity: false,
            notes: null,
            distance: null,
            duration: null,
            hiDuration: null,
            quantity: null,
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
            response: notes,
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
            return this.http.post<NudgeUserDataLog>(this.baseUrl + `/5/trackers/${tracker.id.toString()}/logs`, data, {headers});
        }
        else {
            data.id = tracker.user.logs[0].id.toString();
            data.serverId = tracker.user.logs[0].id;
            return this.http.put<NudgeUserDataLog>(this.baseUrl + `/5/trackers/${tracker.id.toString()}/logs/${data.id}`, data, {headers});
        }
    }

    public deleteTracker(tracker:NudgeTracker, log:NudgeUserDataLog):Observable<any> {
        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", this.apiToken)
            .set("x-api-key", this.apiKey)
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")

        return this.http.delete<any>(this.baseUrl + `/5/trackers/${tracker.id.toString()}/logs/${log.id.toString()}`, {headers})
    }
}