import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class CalendarService {
  private dateSource = new BehaviorSubject<Date>(moment().toDate());
  date = this.dateSource.asObservable();
  currentDate: Date;

  constructor() { }

  updateDate(date: Date) {
    if(this.currentDate == date) return;
    this.currentDate = date;
    this.dateSource.next(date);
  }
}