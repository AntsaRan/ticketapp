import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { tap, mergeMap, map, catchError, switchMap, exhaustMap } from "rxjs/operators";
import { BackendService } from "src/app/backend.service";
import * as TicketActions from "./ticket.actions";
import { Ticket } from "src/interfaces/ticket.interface";
import { Action } from "@ngrx/store";
import { TicketUser } from "../model/ticketUser";
import { of, forkJoin, throwError } from "rxjs";
import { User } from "src/interfaces/user.interface";
import { MatDialog } from "@angular/material/dialog";
import { UtilsService } from "src/app/shared/utils.service";
@Injectable()
export class TickeEffect {
    ticketslist: TicketUser[] = [];
    constructor(private actions$: Actions, private ticketService: BackendService, private dialog: MatDialog,
        private utils: UtilsService,) { }

    loadTickets$ = createEffect(() =>
        this.actions$.pipe(
            tap((val) => console.log('actions', val)),
            ofType(TicketActions.getListTicketsOnInit),
            exhaustMap(action => this.ticketService.tickets1().pipe(
                switchMap((tickets) => {
                    if (tickets && tickets.length > 0) {
                        console.log(tickets, " Tickets")
                        const fetchUserObservables = tickets.map(ticket =>
                            ticket.assigneeId !== null ? this.ticketService.user(ticket.assigneeId) : of(null)
                        );
                        return forkJoin(fetchUserObservables).pipe(
                            map((users: User[]) => {
                                tickets.map((ticket, index) => {
                                    const user = users[index];
                                    const ticketUser = new TicketUser(ticket.id, ticket.completed ? ticket.completed : false, user as User | null, ticket.description);
                                    this.ticketslist.push(ticketUser);
                                });
                                return TicketActions.getListTicketsOnInitSuccess({ tickets: this.ticketslist });
                            })
                        )
                    } else {
                        return of(TicketActions.getListTicketsOnInitFailure({ tickets: [] }));
                    }
                }), catchError(error => {
                    this.utils.errorToast();
                    console.error('Error while getting tickets:', error);
                    return throwError(() => error);
                })

            ))
        ));

        
    loadTicketById$ = createEffect(() =>
    this.actions$.pipe(
        tap((val) => console.log('actions', val)),
        ofType(TicketActions.getTicketbyIdInit),
        exhaustMap(action => this.ticketService.tickets1().pipe(
            switchMap((tickets) => {
                if (tickets && tickets.length > 0) {
                    console.log(tickets, " Tickets")
                    const fetchUserObservables = tickets.map(ticket =>
                        ticket.assigneeId !== null ? this.ticketService.user(ticket.assigneeId) : of(null)
                    );
                    return forkJoin(fetchUserObservables).pipe(
                        map((users: User[]) => {
                            tickets.map((ticket, index) => {
                                const user = users[index];
                                const ticketUser = new TicketUser(ticket.id, ticket.completed ? ticket.completed : false, user as User | null, ticket.description);
                                this.ticketslist.push(ticketUser);
                            });
                            return TicketActions.getListTicketsOnInitSuccess({ tickets: this.ticketslist });
                        })
                    )
                } else {
                    return of(TicketActions.getListTicketsOnInitFailure({ tickets: [] }));
                }
            }), catchError(error => {
                this.utils.errorToast();
                console.error('Error while getting tickets:', error);
                return throwError(() => error);
            })

        ))
    ));
}