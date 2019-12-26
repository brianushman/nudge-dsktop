import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nudge-dsktop';
  apiKey:string = null;
  apiToken:string = null;
  authenticated: boolean = false;

  constructor(private cookieService: CookieService) {
    this.apiKey = this.cookieService.get('nudge-api-key');
    this.apiToken = this.cookieService.get('nudge-api-token');
    this.authenticated = (this.apiToken.length != 0 && this.apiKey.length != 0);
  }

  showLoginPopup() {
    alert('Not Logged In.');
  }
}
