import { Component, OnInit, Input } from '@angular/core';
import { NudgeTracker } from '../models/nudge-tracker';
import { CookieService } from 'ngx-cookie-service';
import { NudgeApiService } from '../services/NudgeApiService';

@Component({
  selector: 'app-copy-entry',
  templateUrl: './copy-entry.component.html',
  styleUrls: ['./copy-entry.component.css']
})
export class CopyEntryComponent implements OnInit {

  @Input() Entry:NudgeTracker;
  @Input() CounterTypes:NudgeTracker[];
  @Input() QuestionTypes:NudgeTracker[];

  constructor(
    private cookieService:CookieService,
    private nudgeApiService:NudgeApiService) {
    }

  ngOnInit() {
  }

  getCounterName(tracker:NudgeTracker):string {
    return tracker.name.substr(tracker.name.indexOf(' '));
  }

  copy() {
    
  }

  submit() {

  }

  cancel() {

  }

}
