import { AppComponent } from './app.component';
import { AddticketDialogComponent } from './addticket-dialog/addticket-dialog.component';
import { BackendService } from './backend.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, Router } from '@angular/router';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { UtilsService } from './shared/utils.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: "",component: TicketListComponent
    },
    {
        path: "ticketDetail/:id",component: TicketDetailsComponent
    },
    {
        path: "**",component: PageNotFoundComponent
    }
]
@NgModule({
    declarations: [AppComponent, TicketDetailsComponent, TicketListComponent, AddticketDialogComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatDividerModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatProgressBarModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatCardModule
    ],

    providers: [BackendService,UtilsService,MatSnackBar],
    bootstrap: [AppComponent]
})
export class AppModule {

}
