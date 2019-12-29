import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as moment from 'moment';
import * as uuid from 'uuid';
import { NudgeTracker, NudgeUserDataLog } from '../models/NudgeTracker';
import { Observable } from 'rxjs/internal/Observable';
import { TrackerType } from '../models/TrackerTypeEnum';
import { CookieService } from 'ngx-cookie-service';
import { INudgeUserInfo } from '../models/INudgeUserInfo';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { CalendarService } from '../calendar/calendar.service';
import { EMPTY } from 'rxjs'

@Injectable({
    providedIn: 'root',
})

export class NudgeApiService {

    private baseUrl:string = 'https://api.nudgeyourself.com';
    private apiKey:string;
    private apiToken:string;
    private userInfo: INudgeUserInfo = null;
    private trackerData:Map<string, NudgeTracker[]> =  new Map();
    
    @Output() notReady = new EventEmitter<NudgeTracker[]>();
    @Output() ready = new EventEmitter<NudgeTracker[]>();
    
    constructor(
        private http:HttpClient,
        private cookieService:CookieService,
        private calendarService:CalendarService) {
            
            this.calendarService.date.subscribe(newDate => {
                if(!this.serviceInitialized()) return;
                var dateStr = this.getDateFormat(newDate);
                
                // check for a cached version before retrieving from the API.
                if(this.trackerData.get(dateStr) != null) {
                    this.ready.emit(this.trackerData.get(dateStr));
                }
                else {
                    this.notReady.emit();
                    this.getData(newDate).subscribe(data => 
                    {
                        this.trackerData.set(dateStr, data);
                        this.ready.emit(data);
                    });
                }
            });
        
            this.apiKey = cookieService.get('nudge-api-key');
            this.apiToken = cookieService.get('nudge-api-token');
            this.notReady.emit();
            this.getUserInfo().subscribe(user => {
                this.userInfo = user;
                let now = moment().toDate();
                this.getData(now).subscribe(data => {
                    this.trackerData.set(this.getDateFormat(now), data);
                    this.ready.emit(data);
                });
            });
    }

    private getUserInfo():Observable<INudgeUserInfo> {
        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", this.apiToken)
            .set("x-api-key", this.apiKey)
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")

        return this.http.get<INudgeUserInfo>(this.baseUrl + '/3/user', {headers})
    }

    private getDateFormat(date:Date) {
        return moment(date).format('YYYY-MM-DD');
    }

    private getData(date:Date) {
        const dateStr:string = this.getDateFormat(date);

        const headers = new HttpHeaders()
            .set("Accept", "application/json")
            .set("x-api-token", this.apiToken)
            .set("x-api-key", this.apiKey)
            .set("Accept-Language", "en-us")
            .set("x-requested-with", "XMLHttpRequest")

        return this.http.get<NudgeTracker[]>(this.baseUrl + `/5/users/${this.userInfo.id}/trackers?log_date_from=${dateStr}&log_date_to=${dateStr}`, {headers});
    }

    public serviceInitialized():boolean {
        return this.userInfo != null;
    }

    public UserInfo():INudgeUserInfo {
        return this.userInfo;
    }

    public TrackerData():NudgeTracker[] {
        return this.trackerData.get(this.getDateFormat(this.calendarService.currentDate));
    }

    public TrackerDataByDate(date:Date):NudgeTracker[] {
        return this.trackerData.get(this.getDateFormat(date));
    }

    public createTrackerCounter(tracker:NudgeTracker, quantity:number, date:Date = null):Observable<NudgeUserDataLog> {
        var timestamp = (date != null) ? moment(date) : moment(moment(this.calendarService.currentDate).format('YYYY-MM-DD ') + moment().format('HH:mm:ss'));
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
        var timestamp = moment(moment(this.calendarService.currentDate).format('YYYY-MM-DD ') + moment().format('HH:mm:ss'));
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
    
    public updateTrackerQuestion(tracker:NudgeTracker, notes:string, date:Date = null):Observable<NudgeUserDataLog> {
        //if(tracker.user.logs.length > 0 && tracker.user.logs[0].response == notes) return EMPTY;

        var timestamp = (date != null) ? moment(date) : moment(moment(this.calendarService.currentDate).format('YYYY-MM-DD ') + moment().format('HH:mm:ss'));
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

    public getHealthyRatingTracker():NudgeTracker {
        if(this.TrackerData() == null) return null;
        for(let i = 0; i < this.TrackerData().length; ++i) {
            if(this.TrackerData()[i].name.toUpperCase().startsWith('HOW HEALTHY')) return this.TrackerData()[i];
        }
        return null;
    }

    public updateHealthyRatingTracker(value:number):Observable<NudgeUserDataLog> {
        var healthTracker = this.getHealthyRatingTracker();
        if(healthTracker.user.logs.length == 0)
        {
            return this.createTrackerCounter(healthTracker, value);
        }
        else
        {
            healthTracker.user.logs[0].quantity = value;
            return this.updateTrackerCounter(healthTracker, healthTracker.user.logs[0]);
        }
    }
}