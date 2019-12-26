import { Component, OnInit, TemplateRef  } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NudgeSource } from '../data-source/nudge-src';
import { NudgeTracker, NudgeUserDataLog } from '../models/nudge-tracker';
import { CalendarService } from '../calendar/calendar.service';
import * as moment from 'moment';
import { TrackerType } from '../models/TrackerTypeEnum';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

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
  openCounterIndex: number = 0;

  constructor(
    private http:HttpClient,
    private cookieService:CookieService,
    private calendarService: CalendarService,
    private toastr: ToastrService) {
    this.nudgeSrc = new NudgeSource(http, cookieService);
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
    this.nudgeSrc.updateTrackerQuestion(tracker, text).subscribe(data => {
      console.debug(data);
    });
  }

  createLogEntry(tracker:NudgeTracker, quantity:number, htmlElement:any) {
    if(quantity == null || quantity <= 0) return;
    this.nudgeSrc.createTrackerCounter(tracker, quantity).subscribe(data => {
      tracker.user.logs.push(data);
      htmlElement.value = '';
      this.openCounterIndex++;
    });
  }

  updateLogEntryQuantity(tracker:NudgeTracker, log:NudgeUserDataLog, quantity:number) {
    if(quantity == null || quantity <= 0) return;
    if(log.quantity == quantity) return;
    
    log.quantity = quantity;
    this.updateLogEntry(tracker, log);
  }

  updateLogEntryNotes(tracker:NudgeTracker, log:NudgeUserDataLog, notes:string) {
    if(log.notes == notes) return;
    
    log.notes = notes;
    this.updateLogEntry(tracker, log);
  }

  updateLogEntryTime(tracker:NudgeTracker, log:NudgeUserDataLog, time:string) {
    if(moment(log.user_time).format('HH:mm a').toUpperCase() == time.toUpperCase()) return;
    
    log.user_time = moment(log.user_time).format('YYYY-MM-DD ') + time;
    this.updateLogEntry(tracker, log);
  }

  updateLogEntry(tracker:NudgeTracker, log:NudgeUserDataLog) {
    this.nudgeSrc.updateTrackerCounter(tracker, log).subscribe(data => {
      let index:number = tracker.user.logs.indexOf(log);
      tracker.user.logs.splice(index, 1, data);
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

  updateOpenCounter(index:number) {
    this.openCounterIndex = index;
  }
}
