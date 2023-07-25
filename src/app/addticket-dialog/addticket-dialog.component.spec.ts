import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddticketDialogComponent } from './addticket-dialog.component';

describe('AddticketDialogComponent', () => {
  let component: AddticketDialogComponent;
  let fixture: ComponentFixture<AddticketDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddticketDialogComponent]
    });
    fixture = TestBed.createComponent(AddticketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
