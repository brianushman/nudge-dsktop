import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import * as uuid from 'uuid';

@Component({
  selector: 'app-material-input',
  templateUrl: './material-input.component.html',
  styleUrls: ['./material-input.component.css']
})
export class MaterialInputComponent implements OnInit {

  @ViewChild("ctrl", {static: false}) htmlComponent: ElementRef;

  @Input() Name: string;
  @Input() Width: string;
  @Input() Multiline: boolean = false;
  @Input() Required: boolean = false;
  @Input() Numeric: boolean = false;
  @Input() Time: boolean = false;

  componentValue:any;
  @Output()
  valueChange = new EventEmitter<any>();
  @Input()
  get value(){
    return this.componentValue;
  }
  set value(val) {
    this.componentValue = val;
    this.valueChange.emit(this.componentValue);
  }

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

  focus() {
    this.htmlComponent.nativeElement.focus();
  }
}
