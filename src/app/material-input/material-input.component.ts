import { Component, OnInit, Input } from '@angular/core';
import * as uuid from 'uuid';

@Component({
  selector: 'app-material-input',
  templateUrl: './material-input.component.html',
  styleUrls: ['./material-input.component.css']
})
export class MaterialInputComponent implements OnInit {

  @Input() Name: string;
  @Input() Width: string;
  @Input() Value: any;
  @Input() Multiline: boolean = false;
  @Input() Required: boolean = false;
  @Input() Numeric: boolean = false;
  @Input() Time: boolean = false;
  uid:string;

  constructor() {
    this.uid = uuid.v4();
  }

  ngOnInit() {
  }

  inputCtrlType() {
    if(this.Numeric) {
      return 'number';
    }
    else if(this.Time) {
      return 'time';
    }
    return 'text';
  }

}
