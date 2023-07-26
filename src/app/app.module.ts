import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { AddticketDialogComponent } from './addticket-dialog/addticket-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';

const routes: Routes = [
    {
        path: "",component: TicketListComponent
    },
    {
        path: "ticketDetail/:id",component: TicketDetailsComponent
    }
]
@NgModule({
    declarations: [AppComponent, TicketDetailsComponent, TicketListComponent, AddticketDialogComponent],
    imports: [
        BrowserModule, MatButtonModule,
        MatFormFieldModule, MatCheckboxModule,
        MatSidenavModule, MatToolbarModule,
        RouterModule.forRoot(routes), BrowserAnimationsModule,
        MatButtonModule, MatDividerModule, MatIconModule,
        MatInputModule, MatSelectModule,
        MatTableModule, MatProgressSpinnerModule,
        MatDialogModule, FormsModule, MatProgressBarModule,
        MatPaginatorModule,MatCardModule,
        MatAutocompleteModule,ReactiveFormsModule
    ],

    providers: [BackendService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
