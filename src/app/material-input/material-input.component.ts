import { Component, OnInit, Input } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
