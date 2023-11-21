import { Routes, RouterModule } from '@angular/router'
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { TicketDetailsComponent } from './ticket/ticket-details/ticket-details.component'
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component'

const routes: Routes = [
    {
        path: "", component: TicketListComponent
    },
    {
        path: "ticketDetail/:id", component: TicketDetailsComponent
    },
    {
        path: "**", component: PageNotFoundComponent
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)], // Use .forRoot() for the root module
    exports: [RouterModule]

})
export class AppRoutingModule { }
