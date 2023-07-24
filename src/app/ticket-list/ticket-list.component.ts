import { BackendService } from '../backend.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketUser } from 'src/app/model/ticketUser';
import { User } from 'src/interfaces/user.interface';
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
  datasource
  isDivHidden = true;

  constructor(private backendService: BackendService,
    private router: Router, public dialog: MatDialog) {
  }

  getTickets() {
    this.backendService.tickets()
      .subscribe(ticket => {
        if (ticket) {
          ticket.forEach(t => {
            console.log(t);
            let userid=t.assigneeId;
            let user=this.getUserById(userid);
            let ticketuser=new TicketUser(t.id,t.completed,user,t.description);
            this.tickets.push(ticketuser);
          })
      
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

}
