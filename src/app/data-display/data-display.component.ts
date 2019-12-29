import { Component, OnInit, ViewChildren, QueryList, TemplateRef  } from '@angular/core';
import { NudgeApiService } from '../services/NudgeApiService';
import { NudgeTracker, NudgeUserDataLog } from '../models/NudgeTracker';
import { CalendarService } from '../calendar/calendar.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MaterialInputComponent } from '../material-input/material-input.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.css']
})
export class DataDisplayComponent implements OnInit {
  @ViewChildren('quantity') quantityFields: QueryList<MaterialInputComponent>;

  readonly questionType: string = 'questions-log';
  readonly counterType: string = 'counters-log';
  modalRef: BsModalRef;
  modalTracker: NudgeTracker;
  modalDate:Date;
  openCounterIndex: number = 0;

  constructor(
    private nudgeApiService:NudgeApiService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private calendarService: CalendarService) {
  }

  ngOnInit() {
  }

  formatDate(date:Date, format:string):string {
    return moment(date).format(format);
  }

  isToday():boolean {
    return moment().diff(moment(this.calendarService.currentDate), 'days') == 0;
  }

  getOrderedTextFields() : NudgeTracker[] {
    if(this.nudgeApiService.TrackerData() == null) return [];
    return this.nudgeApiService.TrackerData().filter(
      (tracker: NudgeTracker) => 
        this.questionType === tracker.meta.log_format &&
        true === tracker.user.settings.enabled
    ).sort((a, b) => (a.user.settings.rank > b.user.settings.rank) ? 1 : -1);
  }

  getOrderedCopyableTextFields() : NudgeTracker[] {
    if(this.nudgeApiService.TrackerData() == null) return [];
    return this.nudgeApiService.TrackerData().filter(
      (tracker: NudgeTracker) => 
        this.questionType === tracker.meta.log_format &&
        true === tracker.user.settings.enabled &&
        true == this.isCopyable(tracker.name)
    ).sort((a, b) => (a.user.settings.rank > b.user.settings.rank) ? 1 : -1);
  }

  getOrderedCounters() : NudgeTracker[] {
    if(this.nudgeApiService.TrackerData() == null) return [];
    return this.nudgeApiService.TrackerData().filter(
      (tracker: NudgeTracker) => 
        this.counterType === tracker.meta.log_format &&
        true === tracker.user.settings.enabled &&
        this.nudgeApiService.getHealthyRatingTracker() != tracker
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
    this.nudgeApiService.updateTrackerQuestion(tracker, text).subscribe(data => {
      if(tracker.user.logs.length == 0) {
        tracker.user.logs.push(data);
      }
      else {
        tracker.user.logs.splice(1, 1, data);
      }
    });
  }

  createLogEntry(tracker:NudgeTracker, quantity:number, htmlElement:any) {
    if(quantity == null || quantity <= 0) {
      this.openCounterIndex++;
      setTimeout(() => {
        this.quantityFields.toArray()[this.openCounterIndex].focus();
      }, 200);
    }
    this.nudgeApiService.createTrackerCounter(tracker, quantity).subscribe(data => {
      tracker.user.logs.push(data);
      htmlElement.value = '';
      this.openCounterIndex++;
      setTimeout(() => {
        this.quantityFields.toArray()[this.openCounterIndex].focus();
      }, 200);
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
    this.nudgeApiService.updateTrackerCounter(tracker, log).subscribe(data => {
      let index:number = tracker.user.logs.indexOf(log);
      tracker.user.logs.splice(index, 1, data);
    });
  }

  deleteLogEntry(tracker:NudgeTracker, log:NudgeUserDataLog) {
    this.nudgeApiService.deleteTracker(tracker, log).subscribe(
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

  isCopyable(trackerName:string):boolean {
    return trackerName.toUpperCase().indexOf("SNACK") >= 0 ||
          trackerName.toUpperCase().indexOf("BREAKFAST") >= 0 ||
          trackerName.toUpperCase().indexOf("LUNCH") >= 0 ||
          trackerName.toUpperCase().indexOf("DINNER") >= 0 ||
          trackerName.toUpperCase().indexOf("MORNING") >= 0 ||
          trackerName.toUpperCase().indexOf("AFTERNOON") >= 0 ||
          trackerName.toUpperCase().indexOf("EVENING") >= 0;
  }

  openCopyModal(template: TemplateRef<any>, tracker:NudgeTracker) {
    this.modalTracker = tracker;
    this.modalDate = this.calendarService.currentDate;
    this.modalRef = this.modalService.show(template, { animated: true, keyboard: false, backdrop: 'static' });
  }

  closeCopyModal() {
    this.modalRef.hide();
  }
}
