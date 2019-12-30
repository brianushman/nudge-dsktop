import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { CalendarService } from './calendar.service';
import { BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

  visibleDates: Date[];
  selectedDate: Date;
  datepickerDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {   
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', showWeekNumbers:false });     
    this.calendarService.date.subscribe(newDate => {
      this.selectedDate = newDate;
      this.datepickerDate = newDate;
    });

    this.generateDateList(moment().toDate(), true);
    this.calendarService.updateDate(this.getLastVisibleDate());
  }

  showDatePicker() {
    this.datepicker.show();
  }

  formatDate(date:Date, format:string):string {
    return moment(date).format(format);
  }

  isSelected(date:Date):boolean {
    return this.selectedDate.getDate() == date.getDate();
  }

  changeSelectedDate(date:Date):void {
    if(date == null) return;
    this.calendarService.updateDate(date);
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
    this.changeSelectedDate(date);
  }
}
