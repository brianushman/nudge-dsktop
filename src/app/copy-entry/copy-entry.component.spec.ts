import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyEntryComponent } from './copy-entry.component';

describe('CopyEntryComponent', () => {
  let component: CopyEntryComponent;
  let fixture: ComponentFixture<CopyEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
