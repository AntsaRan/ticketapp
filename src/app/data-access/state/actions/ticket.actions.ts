import { createAction, props } from "@ngrx/store";
import { TicketUser } from "../../model/ticketUser";
import { Ticket } from "src/interfaces/ticket.interface";

export const getListTicketsOnInit = createAction('[TICKET LIST] Fetch Ticket List On Init');
export const getListTicketsOnInitSuccess = createAction('[Tickets API] load tickets success',props<{ tickets: TicketUser[]} >()); // inscrire les valeurs lorsque la requête sera effectuée 
export const getListTicketsOnInitFailure = createAction('[Tickets API] load tickets failed',props<{ tickets: TicketUser[]} >()); // inscrire les valeurs lorsque la requête sera effectuée 

// Get ticket

export const getTicketbyIdInit = createAction('[Tickets API] Init load ticket by Id',props<{ticketID: number} >()); // 
export const getTicketbyIdSuccess = createAction('[Tickets API] load tickets success',props<{ticket: TicketUser} >()); // 
