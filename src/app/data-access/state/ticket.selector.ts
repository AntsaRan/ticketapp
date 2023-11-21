import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ROOT_FEATURE_KEY, RootState, State } from "./ticket.state";

const selectRoot = createFeatureSelector<RootState>(ROOT_FEATURE_KEY);
export const getTickets = createSelector(selectRoot, (state:RootState) => state.ticketList);
export const checkDataReady = createSelector(selectRoot, (state:RootState) => state.isListReady );
