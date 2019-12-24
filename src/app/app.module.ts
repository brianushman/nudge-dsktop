import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

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
import { LogEntryModalComponent } from './log-entry-modal/log-entry-modal.component';
import { LogEntryModalService } from './log-entry-modal/log-entry-modal.service';

@NgModule({
  declarations: [
    AppComponent,
    DataDisplayComponent,
    LogEntryModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    AutosizeModule,
    CalendarModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [LogEntryModalService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
