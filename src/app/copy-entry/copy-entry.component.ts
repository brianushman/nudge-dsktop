import { Component, OnInit, Input } from '@angular/core';
import { NudgeTracker } from '../models/nudge-tracker';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NudgeSource } from '../data-source/nudge-src';

@Component({
  selector: 'app-copy-entry',
  templateUrl: './copy-entry.component.html',
  styleUrls: ['./copy-entry.component.css']
})
export class CopyEntryComponent implements OnInit {

  nudgeSrc: NudgeSource;
  @Input() Entry:NudgeTracker;
  @Input() CounterTypes:NudgeTracker[];

  constructor(
    private http:HttpClient,
    private cookieService:CookieService) {
      this.nudgeSrc = new NudgeSource(http, cookieService);
    }

  ngOnInit() {
  }

  getCounterName(tracker:NudgeTracker):string {
    return tracker.name.substr(tracker.name.indexOf(' '));
  }

  submit() {

  }

  cancel() {

  }

}
