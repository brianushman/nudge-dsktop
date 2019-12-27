import { Component, TemplateRef, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { NudgeSource } from './data-source/nudge-src';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { NudgeTracker } from './models/nudge-tracker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class AppComponent implements OnInit {
  
  modalRef: BsModalRef;
  title = 'nudge-dsktop';
  apiKey:string = null;
  apiToken:string = null;
  authenticated: boolean = false;
  nudgeSrc: NudgeSource;
  tracker: NudgeTracker;

  constructor(private http:HttpClient,
              private cookieService:CookieService,
              private modalService: BsModalService) {
    this.apiKey = this.cookieService.get('nudge-api-key');
    this.apiToken = this.cookieService.get('nudge-api-token');
    this.authenticated = (this.apiToken.length != 0 && this.apiKey.length != 0);
    this.nudgeSrc = new NudgeSource(http, cookieService);
  }

  ngOnInit(): void {
    this.nudgeSrc.getData(moment().toDate()).subscribe(data => this.tracker = this.nudgeSrc.getHealthyRatingTracker(data));
  }

  showLoginPopup(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { animated: true });
  }

  closeLoginPopup() {
    this.modalRef.hide();
  }

  getHealthRating():number {
    if(this.tracker == null || this.tracker.user == null) return 0;
    if(this.tracker.user.logs.length == 0) return 0;
    return this.tracker.user.logs[0].quantity;
  }

  healthRatingChanged(value:number) {
    this.nudgeSrc.updateHealthyRatingTracker(this.tracker, value).subscribe(data => {
      if(this.tracker.user.logs.length == 0)
        this.tracker.user.logs.push(data);
      else
        this.tracker.user.logs.splice(1, 1, data);
    });
  }
}
