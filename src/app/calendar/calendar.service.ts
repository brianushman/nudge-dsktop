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
    this.currentDate = date;
    this.dateSource.next(date);
  }
}