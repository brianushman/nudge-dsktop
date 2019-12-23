import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { nudgeSource } from '../data-source/nudge-src';
import { NudgeTracker } from '../models/nudge-tracker';
import { CalendarService } from '../calendar/calendar.service';
import * as moment from 'moment';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.css'],
  providers: [CalendarService]
})
export class DataDisplayComponent implements OnInit {

  readonly questionType: string = 'questions-log';
  readonly counterType: string = 'counters-log';
  nudgeSrc: nudgeSource;
  trackerData: NudgeTracker[];

  constructor(private http:HttpClient, private calendarService: CalendarService) {
    this.nudgeSrc = new nudgeSource(http);
  }

  ngOnInit() {
    this.nudgeSrc.getData(moment().toDate()).subscribe(data => this.trackerData = data);

    this.calendarService.date.subscribe(newDate => {
      this.nudgeSrc.getData(moment(newDate).toDate()).subscribe(data => this.trackerData = data);
    });
  }

  getOrderedTextFields() : NudgeTracker[] {
    if(this.trackerData == null) return [];
    return this.trackerData.filter(
      (tracker: NudgeTracker) => 
        this.questionType === tracker.meta.log_format &&
        true === tracker.user.settings.enabled
    ).sort((a, b) => (a.user.settings.rank > b.user.settings.rank) ? 1 : -1);
  }

  getTextFieldText(tracker:NudgeTracker) {
    return tracker.user.logs.length > 0 ? tracker.user.logs[0].response : null;
  }

}
