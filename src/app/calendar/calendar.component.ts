import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  visibleDates: Date[];
  selectedDate: Date;

  constructor() { }

  ngOnInit() {
    this.generateDateList(moment().toDate(), true);
    this.selectedDate = this.getLastVisibleDate();
  }

  formatDate(date:Date, format:string):string {
    return moment(date).format(format);
  }

  isSelected(date:Date):boolean {
    return this.selectedDate.getDate() == date.getDate();
  }

  changeSelectedDate(date:Date):void {
    this.selectedDate = date;
  }

  getLastVisibleDate() : Date {
    return this.visibleDates[this.visibleDates.length - 1];
  }

  getFirstVisibleDate() : Date {
    return this.visibleDates[0];
  }

  generateDateList(date:Date, isLastDate:boolean) {
    let passedDate = moment(date);
    let startDate = moment(passedDate.subtract(isLastDate ? 6 : 3, 'days').toDate());
    this.visibleDates = [];

    for (let i = 0; i < 7; i++) {
      this.visibleDates.push(moment(startDate).add(i, 'days').toDate());
    }
  }

  changeDateByDays(numDays:number):void {
    let newDate = moment(this.getLastVisibleDate());
    newDate.add(numDays, 'days');
    this.generateDateList(newDate.toDate(), true);
  }

  changeDateByDate(date:Date):void {
    this.generateDateList(moment(date).toDate(), false);
  }
}
