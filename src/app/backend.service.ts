import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Ticket } from '../interfaces/ticket.interface';
import { User } from '../interfaces/user.interface';

/**
 * This service acts as a mock back-end.
 * It has some intentional errors that you might have to fix.
 */

function randomDelay() {
    return Math.random() * 4000;
}

@Injectable()
export class BackendService {
    private storagekey = 'storedTickets'; // La clé pour stocker les tickets dans localStorage
    private lastId: number = 1;
    public storedTickets: Ticket[] = [
        {
            id: 0,
            completed: false,
            assigneeId: 111,
            description: 'Install a monitor arm'
        },
        {
            id: 1,
            completed: true,
            assigneeId: 111,
            description: 'Move the desk to the new location'
        }
    ];

    /* constructor() {
         const storedTickets = JSON.parse(localStorage.getItem(this.storagekey));
         if (storedTickets) {
             this.lastId = Math.max(...storedTickets.map((ticket: Ticket) => ticket.id));
         } else {
             this.lastId = 1;
             localStorage.setItem(this.storagekey, JSON.stringify(this.storedTickets));
         }
     }
 */
    public storedUsers: User[] =
        [
            { id: 111, name: 'Victor' },
            { id: 112, name: 'Anna' },
            { id: 113, name: 'Marie' },
        ];

    private findUserById = (id: number) => this.storedUsers.find((user: User) => user.id === +id);
    private findTicketById = (id: number) => this.storedTickets
        .find((ticket: Ticket) => ticket.id === +id);

    private findTicketById1 = (id: number) => JSON.parse(localStorage.getItem(this.storagekey))
        .find((ticket: Ticket) => ticket.id === +id);

    public tickets1(): Observable<Ticket[]> {
        return of(this.storedTickets).pipe(delay(randomDelay()));
    }
    public ticket(id: number): Observable<Ticket> {
        if (this.findTicketById(id) !== undefined) {
            return of(this.findTicketById(id)).pipe(delay(randomDelay()));
        }
    }

    public users(): Observable<User[]> {
        return of(this.storedUsers).pipe(delay(randomDelay()));
    }

    public user(id: number): Observable<User> {
        return of(this.findUserById(id)).pipe(delay(randomDelay()));
    }


    public newTicket1(payload: { description: string }): Observable<Ticket> {
        const newTicket: Ticket = {
            id: ++this.lastId,
            completed: false,
            assigneeId: null,
            description: payload.description
        };

        return of(newTicket).pipe(
            delay(randomDelay()),
            tap((ticket: Ticket) => this.storedTickets.push(ticket))
        );
    }

    public assign1(ticketId: number, userId: number): Observable<Ticket> {
        const user = this.findUserById(+userId);
        const foundTicket = this.findTicketById(+ticketId);

        if (foundTicket && user) {
            return of(foundTicket).pipe(
                delay(randomDelay()),
                tap((ticket: Ticket) => {
                    ticket.assigneeId = +userId;
                    this.updatewithoutLocalStorage(ticket);
                })
            );
        }
        return throwError(new Error('ticket or user not found'));
    }

    public complete1(ticketId: number, completed: boolean): Observable<Ticket> {
        const foundTicket = this.findTicketById(+ticketId);

        if (foundTicket) {
            return of(foundTicket).pipe(
                delay(randomDelay()),
                tap((ticket: Ticket) => {
                    ticket.completed = completed;
                    this.updatewithoutLocalStorage(ticket);
                })
            );
        }
        return throwError(new Error('ticket not found'));
    }

    updatewithoutLocalStorage(ticket: Ticket) {
        // enregistre dans le localstorage
        const index = this.storedTickets.findIndex(t => t.id === ticket.id);
        if (index !== -1) {
            this.storedTickets[index] = ticket;
        }
    }
    /* LOCAL STORAGE 

    public tickets(): Observable<Ticket[]> {
        this.storedTickets = JSON.parse(localStorage.getItem(this.storagekey));
        console.log(this.storedTickets + " from tickets");
        return of(this.storedTickets).pipe(delay(randomDelay()));
    }
    savestoredTicketsToStorage() {
        console.log("ato save store");
        localStorage.setItem(this.storagekey, JSON.stringify(this.storedTickets));
    }

    public newTicket(payload: { description: string }): Observable<Ticket> {
        this.storedTickets = JSON.parse(localStorage.getItem(this.storagekey));
        const newTicket: Ticket = {
            id: ++this.lastId,
            completed: false,
            assigneeId: null,
            description: payload.description
        };

        return of(newTicket).pipe(
            delay(randomDelay()),
            tap((ticket: Ticket) => this.storedTickets.push(ticket)),
            tap(() => console.log(this.storedTickets + " after push")),
            tap(() => this.savestoredTicketsToStorage()),
            tap(() => console.log(JSON.stringify(localStorage.getItem(this.storagekey)) + " StoRAGE"))
        );
    }
    public assign(ticketId: number, userId: number): Observable<Ticket> {
        const user = this.findUserById(+userId);
        const foundTicket = this.findTicketById(+ticketId);

        if (foundTicket && user) {
            return of(foundTicket).pipe(
                delay(randomDelay()),
                tap((ticket: Ticket) => {
                    ticket.assigneeId = +userId;
                    this.updateLocalStorage(ticket);
                })
            );
        }
        this.savestoredTicketsToStorage();
        return throwError(new Error('ticket or user not found'));
    }
    public complete(ticketId: number, completed: boolean): Observable<Ticket> {
        const foundTicket = this.findTicketById(+ticketId);

        if (foundTicket) {
            return of(foundTicket).pipe(
                delay(randomDelay()),
                tap((ticket: Ticket) => {
                    ticket.completed = completed;
                    this.updateLocalStorage(ticket);
                })
            );
        }
        return throwError(new Error('ticket not found'));
    }
    updateLocalStorage(ticket: Ticket) {
        // enregistre dans le localstorage
        this.storedTickets = JSON.parse(localStorage.getItem(this.storagekey));
        const index = this.storedTickets.findIndex(t => t.id === ticket.id);
        if (index !== -1) {
            this.storedTickets[index] = ticket;
            this.savestoredTicketsToStorage();
        }
    }

*/
}
