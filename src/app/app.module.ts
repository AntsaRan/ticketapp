import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { BrowserModule } from '@angular/platform-browser';
import {Component} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  {
      path: "",
      component: TicketListComponent,
  }
]
@NgModule({
    declarations: [AppComponent, TicketDetailsComponent, TicketListComponent],
    imports: [
        BrowserModule, MatButtonModule,
        MatFormFieldModule, MatCheckboxModule,
        MatSidenavModule, MatToolbarModule,
        RouterModule.forRoot(routes),BrowserAnimationsModule,
        MatButtonModule, MatDividerModule, MatIconModule,
        MatInputModule,MatSelectModule],

    providers: [BackendService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
