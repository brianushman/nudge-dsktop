import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-daily-health-rating',
  templateUrl: './daily-health-rating.component.html',
  styleUrls: ['./daily-health-rating.component.css']
})
export class DailyHealthRatingComponent implements OnInit {

  @Input() value:number = 0;
  @Output() selected = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  getFontColor(index:number) {
    return this.value == index ? 'blue' : '#999';
  }

  getCssClass(index:number) {
    return this.value == index ? 'fa' : 'far';
  }

  valueSelected(index:number) {
    this.value = index;
    this.selected.emit(index);
  }
}
