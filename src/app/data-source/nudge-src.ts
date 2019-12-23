import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as moment from 'moment';
import { NudgeTracker } from '../models/nudge-tracker';
import { Observable } from 'rxjs/internal/Observable';

export class nudgeSource {

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
    public getDataFake():NudgeTracker[] {
        return null;
    }

}