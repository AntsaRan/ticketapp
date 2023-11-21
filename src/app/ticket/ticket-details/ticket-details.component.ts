import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../backend.service';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketUser } from '../../data-access/model/ticketUser';
import { User } from 'src/interfaces/user.interface';
import { UtilsService } from '../../shared/utils.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent {
  assigneeCtrl = new FormControl<string | User>('');
  ticketId: number = null;
  filterusers: Observable<User[]>;
  users: User[] = [];
  ticket: Ticket = null;
  ticketUSer: TicketUser = null;
  user: User = null;
  isDataLoaded = false;
  isInputFocused = false;
  selectedUser: User;
  isLoadingAssign = false;
  ticketNotFound = false;
  errorInModif = false;
  selectedUserInput: string;

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.users.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  constructor(private route: ActivatedRoute,
    private backendService: BackendService,
    private utils: UtilsService) {
    this.route.params.subscribe(params => {
      if (params) {
        console.log(params);
        this.ticketId = params['id'];
      }
    });
  }

  ngOnInit() {
    this.getTicket().subscribe(() => {
      if (!this.ticket) {
        this.ticketNotFound = true;
      } else {
        console.log(this.user.name)
        this.assigneeCtrl.setValue(this.user);
        this.filterusers = this.assigneeCtrl.valueChanges.pipe(
          startWith(this.user ? this.user : ''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(name as string) : this.users.slice();
          })
        );
        this.isDataLoaded = true;
      }
    });
  }
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  getTicket(): Observable<void> {
    return of(this.ticketId).pipe(
      switchMap(ticketId => {
        if (!ticketId) {
          return of(null);
        }
        return this.backendService.ticket(ticketId) ? this.backendService.ticket(ticketId) : of(null);
      }),
      switchMap(ticket => {
        if (!ticket) {
          return of(null);
        }
        this.ticket = ticket;
        return this.backendService.user(ticket.assigneeId ? ticket.assigneeId : null).pipe(
          switchMap(user => {
            this.user = user;
            this.ticketUSer = new TicketUser(this.ticket.id, this.ticket.completed, user, this.ticket.description);
            return this.backendService.users()
          })
        );
      }),
      map(users => {
        this.users = users;
      }), catchError(error => {
        this.utils.errorToast();
        console.error('Error whil getting ticket:', error);
        return throwError(() => error);
      })
    );
  }

  completeTicket() {
    this.backendService.complete1(this.ticket.id, true)
      .subscribe(ticketUpdated => {
        if (ticketUpdated) {
          this.getTicket().subscribe();
        }
      })
  }
  assign() {
    this.isLoadingAssign = true;
    if (this.selectedUser) {
      this.backendService.assign1(this.ticket.id, this.selectedUser.id)
        .pipe(
          catchError(error => {
            console.error('Error in assigning ticket:', error);
            this.utils.errorToast();
            return throwError(() => error);
          })
        ).subscribe(ticketUpdated => {
          if (ticketUpdated) {
            this.ticket = ticketUpdated;
            this.getTicket().subscribe(() => {
              this.selectedUser = null;
              this.isLoadingAssign = false;
            });
          }
        });
    }
  }
  onOptionSelected(user: any) {
    this.assigneeCtrl.setValue(user);
  }
  onInputChanged() {
    if (!this.assigneeCtrl.value) {
      this.assigneeCtrl.setValue(null); // Clear the FormControl value
    }
  }
}
