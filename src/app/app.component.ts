import { Component, TemplateRef, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { NudgeApiService } from './services/NudgeApiService';
import { NgxSpinnerService } from "ngx-spinner";
import { INudgeUserInfo } from './models/INudgeUserInfo';

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

  constructor(
    private cookieService:CookieService,
    private modalService: BsModalService,
    private nudgeApiService:NudgeApiService,
    private spinner: NgxSpinnerService) {
      this.nudgeApiService.notReady.subscribe(() => this.spinner.show());
      this.nudgeApiService.ready.subscribe(() => this.spinner.hide());
  }

  ngOnInit(): void {
  }

  isLoggedIn():boolean {
    return null != this.cookieService.get('nudge-api-key');
  }

  getUserName():string {
    return this.nudgeApiService.UserInfo().firstname;
  }

  getUserInfo():INudgeUserInfo {
    return this.nudgeApiService.UserInfo();
  }

  isDataReady():boolean {
    return this.nudgeApiService.serviceInitialized();
  }

  showLoginPopup(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { animated: true });
  }

  closeLoginPopup() {
    this.modalRef.hide();
  }

  getHealthRating():number {
    var healthTracker = this.nudgeApiService.getHealthyRatingTracker();
    return healthTracker == null || this.nudgeApiService.getHealthyRatingTracker().user.logs.length == 0 ? 0 : this.nudgeApiService.getHealthyRatingTracker().user.logs[0].quantity;
  }

  healthRatingChanged(value:number) {
    var healthTracker = this.nudgeApiService.getHealthyRatingTracker();
    this.nudgeApiService.updateHealthyRatingTracker(value).subscribe(data => {
      if(healthTracker.user.logs.length == 0)
      healthTracker.user.logs.push(data);
      else
      healthTracker.user.logs.splice(1, 1, data);
    });
  }
}
