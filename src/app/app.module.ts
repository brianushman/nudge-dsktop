import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from 'ngx-icons';
import { AutosizeModule } from 'ngx-autosize';
import { CalendarModule } from './calendar/calendar.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataDisplayComponent } from './data-display/data-display.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MaterialInputComponent } from './material-input/material-input.component';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CopyEntryComponent } from './copy-entry/copy-entry.component';
import { DailyHealthRatingComponent } from './daily-health-rating/daily-health-rating.component'; 
import { NudgeApiService } from './services/NudgeApiService';

@NgModule({
  declarations: [
    AppComponent,
    DataDisplayComponent,
    MaterialInputComponent,
    LoginComponent,
    CopyEntryComponent,
    DailyHealthRatingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    AutosizeModule,
    CalendarModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    BsDropdownModule.forRoot()
  ],
  providers: [CookieService, NudgeApiService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
