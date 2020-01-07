import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NudgeTracker } from '../models/NudgeTracker';
import { CookieService } from 'ngx-cookie-service';
import { NudgeApiService } from '../services/NudgeApiService';
import { BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

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
  @Output() onSave = new EventEmitter<Date>();

  refCount:number = 0;
  copyEntry:NudgeTracker;
  bsConfig: Partial<BsDatepickerConfig>;
  disabledDates: Date[];
  quantities:Map<number,number>;
  cookieName = 'nudgedsktop-copymeal-cache';
  quickCopyEnabled:boolean = false;
  quickCopyMealName:string;

  constructor(
    private cookieService:CookieService,
    private nudgeApiService:NudgeApiService,
    private toastr: ToastrService) {
    }

  ngOnInit() {
    this.copyEntry = this.Entry;
    this.EntryDate = this.getCopyToDate();
    
    this.bsConfig = Object.assign({}, { 
      containerClass: 'theme-dark-blue',
      adaptivePosition: true,
      showWeekNumbers:false,
      selectFromOtherMonth: true
    });

    this.quantities = this.getMeal(this.Entry.user.logs[0].response);
    this.disabledDates = [
      moment(this.EntryDate).toDate()
    ];
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
    if(this.Entry.user.logs.length == 0) return '';
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
      this.toastr.warning('The meal on your chosen date does not have an entry. Choose a new date at the top of this dialog box.', 'Error');
      return;
    }

    if(this.quickCopyEnabled && (this.quickCopyMealName == null || this.quickCopyMealName.length == 0)) {
      this.toastr.warning('If Add To Quick Copy is Enabled, a name must be chosen.');
      return;
    }

    this.updateMealCacheValues(this.getMealText(), this.quantities);
    if(this.quickCopyEnabled) this.nudgeApiService.QuickCopyMeals(this.quickCopyMealName, this.getMealText());
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
    this.nudgeApiService.updateTrackerQuestion(this.copyEntry, this.Entry.user.logs[0].response, this.EntryDate).subscribe(x => {
      let tracker = this.nudgeApiService.TrackerDataByDateAndId(this.EntryDate, this.copyEntry.id)
      this.popRef();
      tracker.user.logs.splice(0, 1, x);
    });
    this.quantities.forEach((value: number, key: number) => {
      if(value > 0) this.nudgeApiService.createTrackerCounter(this.getTrackerById(key), value, this.EntryDate).subscribe(x => {
        let tracker = this.nudgeApiService.TrackerDataByDateAndId(this.EntryDate, key);
        this.popRef();
        tracker.user.logs.push(x);
      });
      else this.popRef();
    });
  }

  getTrackerById(id:number):NudgeTracker {
    for(let i = 0; i < this.CounterTypes.length; ++i) {
      if(this.CounterTypes[i].id == id) return this.CounterTypes[i];
    }
    return null;
  }

  quickCopyEnabledChanged(value:boolean) {
    this.quickCopyEnabled = !this.quickCopyEnabled;
  }

  private getMeal(value:string):Map<number,number> {
    let cookieString = this.cookieService.get(this.cookieName);
    if(cookieString == "") {
      return this.buildEmptyMealTemplate();
    }
    let cookieValue:Map<string,string> = new Map(JSON.parse(cookieString));
    
    let mealString = cookieValue.get(value);
    if(mealString == null || mealString == "") return this.buildEmptyMealTemplate();
    return new Map<number,number>(JSON.parse(mealString));
  }

  private updateMealCacheValues(mealName:string, value: Map<number,number>) {
    let cookieString = this.cookieService.get(this.cookieName);
    let cookieValue:Map<string,string> = (cookieString == "") ? new Map() : new Map(JSON.parse(cookieString));

    cookieValue.set(mealName, JSON.stringify(Array.from(value.entries())));
    this.nudgeApiService.setCookie(this.cookieName, JSON.stringify(Array.from(cookieValue.entries())));
  }

  private buildEmptyMealTemplate():Map<number,number> {
    let map = new Map<number,number>();
    this.CounterTypes.forEach(counter => {
      map.set(counter.id, 0);
    });
    return map;
  }

  private getCopyToDate():Date {
    if(moment().format('YYYYMMDD') == moment(this.EntryDate).format('YYYYMMDD')) return moment().add(1, 'days').toDate();
    else return moment().toDate();
  }
}
