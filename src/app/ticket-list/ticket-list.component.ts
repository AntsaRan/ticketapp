import { BackendService } from '../backend.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketUser } from 'src/app/model/ticketUser';
import { User } from 'src/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table'; // Assurez-vous d'importer le module MatTableModule
import { concatMap, forkJoin } from 'rxjs';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('out', style({ opacity: 0, transform: 'translateY(-50%)' })), //

      transition('out => in', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('500ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition('in => out', [
        animate('600ms ease', style({ opacity: 0, transform: 'translateY(-50%)' })),
      ]),
    ]),
  ],
})
export class TicketListComponent {
  tickets: TicketUser[] = [];
  isDivHidden = true;
  dataready=false;
  constructor(private backendService: BackendService,
    private router: Router) {
  }
  getTickets() {
    this.backendService.tickets().subscribe(tickets => {
      if (tickets) {
        console.log(tickets);
        const donnees = tickets.map(ticket => this.backendService.user(ticket.assigneeId));
        forkJoin(donnees).subscribe((users: User[]) => {
          users.forEach((user, index) => {
            const ticket = tickets[index];
            const ticketUser = new TicketUser(
              ticket.id,
              ticket.completed,
              user,
              ticket.description
            );
            console.log(ticketUser);
            this.tickets.push(ticketUser);
          });
          this.dataready=true;
        });
      }
    });
  }


  getUserById(id: number): User {
    let userFound;
    this.backendService.user(id)
      .subscribe(user => {
        if (user) {
          userFound = user;
        }
      })
    return userFound;
  }
  ngOnInit(): void {
    this.getTickets();
  }
  togglefilter() {
    this.isDivHidden = !this.isDivHidden; // toggle
  }
  dataSource = this.tickets;
  onButtonClick(row: any) {

  }
}
