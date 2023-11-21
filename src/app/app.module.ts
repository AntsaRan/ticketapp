import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule, isDevMode } from '@angular/core';
import { TicketListModule } from './ticket/ticket-list/ticket-list.module';
import { UtilsService } from './shared/utils.service';
import { AppRoutingModule } from './app.routing';
import { TicketDetailsModule } from './ticket/ticket-details/ticket-details.module';
import { MatIconModule } from '@angular/material/icon';
import { AddTicketModule } from './ticket/addticket-dialog/addticket.module';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { metaReducers, ticketReducer } from './data-access/state/reducers/ticket.reducer';
import { StoreDevtools, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { TickeEffect } from './data-access/state/effects/ticket.effects';
import { ROOT_FEATURE_KEY } from './data-access/state/ticket.state';

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatCheckboxModule,MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        TicketListModule,
        TicketDetailsModule,
        AddTicketModule,
        MatButtonModule,
        StoreModule.forRoot({[ROOT_FEATURE_KEY]: ticketReducer},{metaReducers: metaReducers}),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode()}),
        EffectsModule.forRoot([TickeEffect]),
    ],

    providers: [BackendService,UtilsService,MatSnackBar],
    bootstrap: [AppComponent]
})
export class AppModule {

}
