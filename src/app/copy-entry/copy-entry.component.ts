import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NudgeTracker } from '../models/NudgeTracker';
import { CookieService } from 'ngx-cookie-service';
import { NudgeApiService } from '../services/NudgeApiService';
import { BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { NudgeCopyType } from '../models/NudgeCopyType';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-copy-entry',
  templateUrl: './copy-entry.component.html',
  styleUrls: ['./copy-entry.component.scss']
})
export class CopyEntryComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;

  @Input() CopyType:NudgeCopyType;
  @Input() EntryDate:Date;
  @Input() Entry:NudgeTracker;
  @Input() CounterTypes:NudgeTracker[];
  @Input() QuestionTypes:NudgeTracker[];

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Date>();

  refCount:number = 0;
  copyEntry:NudgeTracker;
  bsConfig: Partial<BsDatepickerConfig>;
  disabledDates: Date[];
  quantities:Map<number,number>;
  cookieName = 'nudgedsktop-copymeal-cache';

  constructor(
    private cookieService:CookieService,
    private nudgeApiService:NudgeApiService,
    private toastr: ToastrService) {
    }

  ngOnInit() {        
    this.copyEntry = this.Entry;
    this.quantities = this.getMeal(this.Entry.user.logs[0].response);

    this.disabledDates = [
      moment(this.EntryDate).toDate()
    ];

    this.EntryDate = (this.CopyType == NudgeCopyType.From) ? 
        this.getStartingCopyFromDate() : this.getStartingCopyToDate();
    
    this.bsConfig = Object.assign({}, { 
      containerClass: 'theme-dark-blue',
      adaptivePosition: true,
      showWeekNumbers:false,
      selectFromOtherMonth: true
    });
  }

  formatDate(date:Date, format:string):string {
    return moment(date).format(format);
  }

  updateQuantity(trackerId:number, value:number) {
    this.quantities.set(trackerId, value);
  }

  getCounterName(trackerId:number):string {
    let tracker = this.getTrackerById(trackerId);
    return tracker.name.substr(tracker.name.indexOf(' '));
  }

  mapValues(index:number) {
    return Array.from(this.quantities.values())[index];
  }

  getMealText():string {
    if(this.Entry.user.logs.length == 0) return null;
    return this.Entry.user.logs[0].response;
  }

  onDateChanged(value:Date) {
    
  }

  openCalendar() {
    this.datepicker.bsValue = this.EntryDate;
    this.datepicker.show();
  }

  submit() {
    if(this.getMealText() == null || this.getMealText().length == 0) {
      this.toastr.error('The meal on your chosen date does not have an entry. Choose a new date at the top of this dialog box.', 'Error');
      return;
    }

    this.saveMeal(this.Entry.user.logs[0].response, this.quantities);
    this.copyMeal();
  }

  cancel() {
    this.onCancel.emit();
  }

  popRef() {
    this.refCount--;
    if(this.refCount <= 0) this.onSave.emit(this.EntryDate);
  }

  copyMeal() {
    this.refCount = this.quantities.keys.length + 1;
    this.nudgeApiService.updateTrackerQuestion(this.copyEntry, this.Entry.user.logs[0].response, this.EntryDate).subscribe(x => this.popRef());
    this.quantities.forEach((value: number, key: number) => {
      if(value > 0) this.nudgeApiService.createTrackerCounter(this.getTrackerById(key), value, this.EntryDate).subscribe(x => this.popRef());
      else this.popRef();
    });
  }

  getTrackerById(id:number):NudgeTracker {
    for(let i = 0; i < this.CounterTypes.length; ++i) {
      if(this.CounterTypes[i].id == id) return this.CounterTypes[i];
    }
    return null;
  }

  getMeal(value:string):Map<number,number> {
    let cookieString = this.cookieService.get(this.cookieName);
    if(cookieString == "") {
      let map = new Map<number,number>();
      this.CounterTypes.forEach(counter => {
        map.set(counter.id, 0);
      });
      return map;
    }
    let cookieValue:Map<string,string> = new Map(JSON.parse(cookieString));
    
    let mealString = cookieValue.get(value);
    if(mealString == null || mealString == "") return null;
    return new Map<number,number>(JSON.parse(mealString));
  }

  saveMeal(mealName:string, value: Map<number,number>) {
    let cookieString = this.cookieService.get(this.cookieName);
    let cookieValue:Map<string,string> = (cookieString == "") ? new Map() : new Map(JSON.parse(cookieString));

    cookieValue.set(mealName, JSON.stringify(Array.from(value.entries())));
    this.setCookie(this.cookieName, JSON.stringify(Array.from(cookieValue.entries())));
  }

  setCookie(name:string, value:string):void {
    if(!environment.production) {
      this.cookieService.set(name, value, 100000, "/", 'localhost', false, "Lax");
    }
    else {
      this.cookieService.set(
        name, 
        value, 
        100000,
        '/nudge-dsktop',
        'brianushman.github.io',
        true,
        'Strict');
    }
  }

  private getStartingCopyFromDate():Date {
    if(moment().format('YYYYMMDD') == moment(this.EntryDate).format('YYYYMMDD')) return moment().subtract(1, 'days').toDate();
    else return moment().toDate();
  }

  private getStartingCopyToDate():Date {
    if(moment().format('YYYYMMDD') == moment(this.EntryDate).format('YYYYMMDD')) return moment().add(1, 'days').toDate();
    else return moment().toDate();
  }
}
