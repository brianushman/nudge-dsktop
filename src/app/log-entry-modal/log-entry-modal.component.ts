import { Component, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-log-entry-modal',
  templateUrl: './log-entry-modal.component.html',
  styleUrls: ['./log-entry-modal.component.css'],
  providers: [BsModalService]
})
export class LogEntryModalComponent {
  @Input() title: string = 'Modal with component';
  @Input() message: string = 'Message here...';

  constructor(public bsModalRef: BsModalRef) { }

  public clickOk() {
    console.log("Click ok...");
  }
}
