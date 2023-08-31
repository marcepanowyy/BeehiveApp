import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialog1Component } from './dialog1.component';

describe('DialogComponent', () => {
  let component: Dialog1Component;
  let fixture: ComponentFixture<Dialog1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Dialog1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dialog1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
