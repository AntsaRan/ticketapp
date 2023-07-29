import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddticketDialogComponent } from './addticket-dialog.component';
import { of } from 'rxjs';
import { User } from 'src/interfaces/user.interface';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketUser } from '../model/ticketUser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BackendService } from '../backend.service';
import { MatDialogRef } from '@angular/material/dialog';

describe('AddticketDialogComponent', () => {
  let component: AddticketDialogComponent;
  let fixture: ComponentFixture<AddticketDialogComponent>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>; // Spy on BackendService

  const ticketsMock: Ticket[] = [
    // Define your mock ticket data here
    { id: 1, completed: true, assigneeId: 101, description: 'Ticket 1' },
    { id: 2, completed: false, assigneeId: 102, description: 'Ticket 2' },
  ];

  const usersMock: User[] = [
    // Define your mock user data here
    { id: 101, name: 'Antsa Ranarivelo' },
    { id: 102, name: 'Maharo Rivomahefa' },
  ];
  const newticket: Ticket = { id: 3, completed: false, assigneeId: null, description: 'New ticket' };

  beforeEach(async() => {
    const backendServiceSpyObj = jasmine.createSpyObj('BackendService', ['newTicket1']); // Provide method names in an array

    await TestBed.configureTestingModule({
      declarations: [AddticketDialogComponent],
      providers: [
        { provide: BackendService, useValue: backendServiceSpyObj }, MatSnackBar,      
        { provide: MatDialogRef, useValue: {} },
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatDividerModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatProgressBarModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatCardModule, RouterModule
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AddticketDialogComponent);
    component = fixture.componentInstance;
    backendServiceSpy = TestBed.inject(BackendService) as jasmine.SpyObj<BackendService>;

    backendServiceSpy.newTicket1.and.returnValue(of(newticket));
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a ticket', () => {
    const description = 'New ticket';
    component.descriptionTicket = description;
    component.add_ticket();

    expect(backendServiceSpy.newTicket1).toHaveBeenCalledWith({ description });

    expect(component.inprogress).toBe(false);

    expect(component.ticketIsAdded).toBe(true);
 
    expect(component.newticket).toEqual(newticket);
  });

});
