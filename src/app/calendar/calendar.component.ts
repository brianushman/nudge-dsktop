import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  visibleDates: moment.Moment[];
  selectedDate: moment.Moment;

  constructor() { }

  ngOnInit() {
    this.generateDateList(moment().toDate(), true);
    this.selectedDate = this.visibleDates[this.visibleDates.length - 1];
  }

  isSelected(date:moment.Moment):boolean {
    return this.selectedDate == date;
  }

  generateDateList(date:Date, isLastDate:boolean) {
    let passedDate = moment(date);
    let startDate = moment(passedDate.subtract(isLastDate ? 6 : 3, 'days').toDate());
    this.visibleDates = [];

    for (let i = 0; i < 7; i++) {
      this.visibleDates.push(moment(startDate).add(i, 'days'));
    }
  }

}
