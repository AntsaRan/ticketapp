import { state } from "@angular/animations";
import { Action, ActionReducer, MetaReducer, createReducer, on } from "@ngrx/store";
import { RootState, State, initialState } from "../ticket.state";
import { getListTicketsOnInit, getListTicketsOnInitFailure, getListTicketsOnInitSuccess, getTicketbyIdInit } from "../actions/ticket.actions";

/*const initialState = {
    appName: "Ticket App",
    //ticketList: ["test"] ,
    dataready: false
}*/
export const metaReducers: MetaReducer[] = [log];
function log(reducer: ActionReducer<State>): ActionReducer<State> {
    return (state, action) => {
        const currentState = reducer(state, action);
        console.log('Etat précédent', state);
        return currentState;
    }
}
export const ticketReducer = createReducer<RootState, Action>(
    initialState,
    on(getListTicketsOnInit, (state: RootState,props) => {
        return {
            ...state
        }
    }),
    on(getListTicketsOnInitSuccess, (state: RootState,props) => {
        return {
            ...state,
            ticketList: props.tickets,
            isListReady: true
        }
    }),
    on(getListTicketsOnInitFailure, (state: RootState,props) => {
        return {
            ...state,
            ticketList: props.tickets,
            isListReady: false
        }
    }),
    on(getTicketbyIdInit, (state: RootState,props) => {
        return{
            ...state,
        }
    })
);
