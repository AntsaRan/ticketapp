import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/interfaces/ticket.interface';
import { MatCardModule } from '@angular/material/card'
import { map, startWith, switchMap } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from 'src/interfaces/user.interface';
import { BackendService } from '../backend.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl } from '@angular/forms';
import { TicketUser } from '../model/ticketUser';
import { forkJoin, of } from 'rxjs';
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
  isDataLoaded=false;
  isInputFocused = false;

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.users.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  constructor(private route: ActivatedRoute, private backendService: BackendService) {
    this.route.params.subscribe(params => {
      if (params) {
        console.log(params);
        this.ticketId = params['id'];
      }
    });
  }
  ngOnInit() {
    this.getTicket().subscribe(() => {
      console.log(this.user.name);
      this.assigneeCtrl.setValue(this.user); // Set the initial value of the assigneeCtrl to the user object
      console.log(this.user.name +" after");
      this.filterusers = this.assigneeCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.users.slice();
        })
      );
      this.isDataLoaded=true;
    });
  }
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }
  getTicket(): Observable<void> {
    return this.backendService.ticket(this.ticketId).pipe(
      switchMap(ticket => {
        this.ticket = ticket;
        return this.backendService.user(ticket.assigneeId);
      })
    ).pipe(
      switchMap(user => {
        this.user = user;
        this.ticketUSer = new TicketUser(this.ticket.id, this.ticket.completed, user, this.ticket.description);
        return this.backendService.users();
      })
    ).pipe(
      map(users => {
        this.users = users;
      })
    );
  }
}
