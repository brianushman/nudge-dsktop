import { Component, OnInit, TemplateRef  } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NudgeSource } from '../data-source/nudge-src';
import { NudgeTracker, NudgeUserDataLog } from '../models/nudge-tracker';
import { CalendarService } from '../calendar/calendar.service';
import * as moment from 'moment';
import { TrackerType } from '../models/TrackerTypeEnum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.css']
})
export class DataDisplayComponent implements OnInit {

  readonly questionType: string = 'questions-log';
  readonly counterType: string = 'counters-log';
  nudgeSrc: NudgeSource;
  trackerData: NudgeTracker[];

  constructor(
    private http:HttpClient,
    private calendarService: CalendarService,
    private toastr: ToastrService) {
    this.nudgeSrc = new NudgeSource(http);
  }

  ngOnInit() {
    this.nudgeSrc.getData(moment().toDate()).subscribe(data => this.trackerData = data);

    this.calendarService.date.subscribe(newDate => {
      this.nudgeSrc.getData(moment(newDate).toDate()).subscribe(data => this.trackerData = data);
    });
  }

  formatDate(date:Date, format:string):string {
    return moment(date).format(format);
  }

  getOrderedTextFields() : NudgeTracker[] {
    if(this.trackerData == null) return [];
    return this.trackerData.filter(
      (tracker: NudgeTracker) => 
        this.questionType === tracker.meta.log_format &&
        true === tracker.user.settings.enabled
    ).sort((a, b) => (a.user.settings.rank > b.user.settings.rank) ? 1 : -1);
  }

  getOrderedCounters() : NudgeTracker[] {
    if(this.trackerData == null) return [];
    return this.trackerData.filter(
      (tracker: NudgeTracker) => 
        this.counterType === tracker.meta.log_format &&
        true === tracker.user.settings.enabled
    ).sort((a, b) => (a.user.settings.rank > b.user.settings.rank) ? 1 : -1);
  }

  getTextFieldText(tracker:NudgeTracker) {
    return tracker.user.logs.length > 0 ? tracker.user.logs[0].response : null;
  }

  getCounterTargetQuantity(tracker:NudgeTracker):number {
    return parseInt(tracker.name.substr(0, tracker.name.indexOf(' ')));
  }

  getCounterEnteredQuantity(tracker:NudgeTracker):number {
    if(tracker.user.logs.length == 0) return 0;
    return tracker.user.logs
      .map((val, index) => { return val.quantity; })
      .reduce(function(a,b) { return a + b;});
  }

  getCounterName(tracker:NudgeTracker):string {
    return tracker.name.substr(tracker.name.indexOf(' '));
  }

  updateTextField(tracker:NudgeTracker, text:string) {
    this.nudgeSrc.updateTracker(tracker, TrackerType.Question, null, text).subscribe(data => {
      console.debug(data);
    });
  }

  createLogEntry(tracker:NudgeTracker, quantity:number) {
    this.nudgeSrc.updateTracker(tracker, TrackerType.Counter, quantity).subscribe(data => {
      console.debug(data);
    });
  }

  deleteLogEntry(tracker:NudgeTracker, log:NudgeUserDataLog) {
    this.nudgeSrc.deleteTracker(tracker, log).subscribe(
      data => {
        if(!data.success) this.toastr.error('Unable to remove log entry.', 'Error');
        tracker.user.logs.splice(tracker.user.logs.indexOf(log), 1);
      },
      error => {
        this.toastr.error('Unable to remove log entry.', 'Error');
      }
    );
  }
}
