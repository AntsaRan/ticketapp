import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/interfaces/ticket.interface';
import { MatCardModule } from '@angular/material/card'
import { catchError, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { User } from 'src/interfaces/user.interface';
import { BackendService } from '../backend.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl } from '@angular/forms';
import { TicketUser } from '../model/ticketUser';
import { forkJoin, of, throwError } from 'rxjs';
import { UtilsService } from '../shared/utils.service';
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
        this.assigneeCtrl.setValue(this.user);
        this.filterusers = this.assigneeCtrl.valueChanges.pipe(
          startWith(''),
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
        return this.backendService.ticket(ticketId).pipe(
          catchError(error => {
            this.utils.errorToast();
            console.error('Error fetching ticket:', error);
            return of(null);
          })
        );
      }),
      switchMap(ticket => {
        if (!ticket) {
          return of(null);
        }
        this.ticket = ticket;
        return this.backendService.user(ticket.assigneeId ? ticket.assigneeId : null).pipe(
          catchError(error => {
            this.utils.errorToast();
            console.error('Error fetching user:', error);
            return of(null);
          }),
          switchMap(user => {
            this.user = user;
            this.ticketUSer = new TicketUser(this.ticket.id, this.ticket.completed, user, this.ticket.description);
            return this.backendService.users().pipe(
              catchError(error => {
                this.utils.errorToast();
                console.error('Error fetching users:', error);
                return of([]);
              })
            )
          })
        );
      }),
      map(users => {
        this.users = users;
      }), catchError(error => {
        this.utils.errorToast();
        console.error('Error in getTicket:', error);
        return throwError(() => error);
      })
    );
  }

  completeTicket() {
    this.backendService.complete1(this.ticket.id, true).pipe(
      catchError(error => {
        console.error('Error in completing ticket:', error);
        this.utils.errorToast();
        return throwError(() => error);
      })
    ).subscribe(ticketUpdated => {
      if (ticketUpdated) {
        this.getTicket().pipe(
          catchError(error => {
            console.error('Error in getTicket:', error);
            this.utils.errorToast();
            return throwError(() => error);
          })
        ).subscribe(() => {

        })
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
            this.isLoadingAssign = false;
            this.ticket = ticketUpdated;
            this.getTicket().subscribe(() => {
              this.selectedUser = null;
            });
          }
        });
    }
  }
  onOptionSelected(user: any) {
    console.log('Selected User:', JSON.stringify(user));
    this.selectedUser = user;
  }
}
