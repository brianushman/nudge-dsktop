import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NudgeTracker } from '../models/nudge-tracker';
import { CookieService } from 'ngx-cookie-service';
import { NudgeApiService } from '../services/NudgeApiService';
import { BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-copy-entry',
  templateUrl: './copy-entry.component.html',
  styleUrls: ['./copy-entry.component.scss']
})
export class CopyEntryComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

  @Input() EntryDate:Date;
  @Input() Entry:NudgeTracker;
  @Input() CounterTypes:NudgeTracker[];
  @Input() QuestionTypes:NudgeTracker[];

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private cookieService:CookieService,
    private nudgeApiService:NudgeApiService) {
    }

  ngOnInit() {
    this.bsConfig = Object.assign({}, { 
      containerClass: 'theme-dark-blue',
      adaptivePosition: true
    });
  }

  formatDate(date:Date, format:string):string {
    return moment(date).format(format);
  }

  getCounterName(tracker:NudgeTracker):string {
    return tracker.name.substr(tracker.name.indexOf(' '));
  }

  openCalendar() {
    this.datepicker.show();
  }

  copy() {
    
  }

  submit() {

  }

  cancel() {

  }

}
