import { Component, TemplateRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class AppComponent {
  modalRef: BsModalRef;
  title = 'nudge-dsktop';
  apiKey:string = null;
  apiToken:string = null;
  authenticated: boolean = false;

  constructor(private cookieService: CookieService,
              private modalService: BsModalService) {
    this.apiKey = this.cookieService.get('nudge-api-key');
    this.apiToken = this.cookieService.get('nudge-api-token');
    this.authenticated = (this.apiToken.length != 0 && this.apiKey.length != 0);
  }

  showLoginPopup(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { animated: true });
  }

  closeLoginPopup() {
    this.modalRef.hide();
  }
}
