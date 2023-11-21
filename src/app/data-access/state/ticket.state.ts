import { TicketUser } from "../model/ticketUser";

export const ROOT_FEATURE_KEY = "tickets"
export interface State {
    readonly [ROOT_FEATURE_KEY]: RootState;
}
export interface RootState {

    ticketList: TicketUser[],
    isListReady: boolean
}

export const initialState: RootState = {

    ticketList: [],
    isListReady: false

}

