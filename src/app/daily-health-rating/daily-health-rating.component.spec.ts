import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyHealthRatingComponent } from './daily-health-rating.component';

describe('DailyHealthRatingComponent', () => {
  let component: DailyHealthRatingComponent;
  let fixture: ComponentFixture<DailyHealthRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyHealthRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyHealthRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
