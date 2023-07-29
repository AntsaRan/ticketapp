import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketListComponent } from './ticket-list.component';
import { BackendService } from '../backend.service';
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

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
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

  beforeEach(async () => {
    const backendServiceSpyObj = jasmine.createSpyObj('BackendService', ['tickets1', 'user']);

    await TestBed.configureTestingModule({
      declarations: [TicketListComponent],
      providers: [
        { provide: BackendService, useValue: backendServiceSpyObj }, MatSnackBar
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

    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;

    backendServiceSpy = TestBed.inject(BackendService) as jasmine.SpyObj<BackendService>;

    backendServiceSpy.tickets1.and.returnValue(of(ticketsMock));
    backendServiceSpy.user.and.callFake((userId: number) => {
      // Implement the fake user method to return mock users based on userId
      return of(usersMock.find((user) => user.id === userId) || null);
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should fetch tickets on initialization', () => {
    
    expect(backendServiceSpy.tickets1).toHaveBeenCalled();
    expect(backendServiceSpy.user.calls.count()).toBe(usersMock.length);

    const expectedTickets: TicketUser[] = ticketsMock.map((ticket) => {
      const user = usersMock.find((u) => u.id === ticket.assigneeId) || null;
      return new TicketUser(ticket.id, ticket.completed, user, ticket.description);
    });

    // Now, we expect the ticketslist in the component to match our expectedTickets
    expect(component.ticketslist).toEqual(expectedTickets);
  });

});