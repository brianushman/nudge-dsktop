import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LogEntryModalComponent } from './log-entry-modal.component';

export class LogEntryModalService {
  constructor(private modalService: BsModalService) {
  }
  showConfirm(title?: string, message?: string) {
       //let bsModalRef = this.modalService.show(LogEntryModalComponent, { animated: true, keyboard: true, backdrop: true, ignoreBackdropClick: false });
       //console.log("bsModalRef: ", bsModalRef);
  }
}