import { BackendService } from '../backend.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketUser } from 'src/app/model/ticketUser';
import { User } from 'src/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table'; // Assurez-vous d'importer le module MatTableModule
import { catchError, concatMap, forkJoin } from 'rxjs';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AddticketDialogComponent } from '../addticket-dialog/addticket-dialog.component';
import { of } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('out', style({ opacity: 0, transform: 'translateY(-50%)' })), //

      transition('out => in', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('500ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition('in => out', [
        animate('600ms ease', style({ opacity: 0, transform: 'translateY(-50%)' })),
      ]),
    ]),
  ],
})
export class TicketListComponent {
  ticketslist: TicketUser[] = [];
  isDivHidden = true;
  dataready = false;
  dataloaded = false;
  dataSource: MatTableDataSource<TicketUser>;
  ticketIsAdded = false;
  addticketmessage = "";
  ticketNotFound = false;
  // FILTERS
  filterAssignee: string = "";
  filterDesc: string = "";
  statusFilter: boolean | null = null;

  //DETAILS
  ticketID: number | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private backendService: BackendService,
    private router: Router, private dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.getTickets(); 
    this.dataSource = new MatTableDataSource(this.ticketslist);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(assigneeFilterValue: string, statusFilterValue: boolean | null, descFilterValue: string) {
    const filters = {
      assignee: assigneeFilterValue.trim().toLowerCase(),
      status: statusFilterValue,
      description: descFilterValue.trim().toLowerCase()
    };
    this.dataSource.data = this.ticketslist.filter((ticketUser: TicketUser) => {
      const assigneeFiltering = ticketUser.user?.name?.toLowerCase() || '-';
      const statusFiltering = filters.status === null || ticketUser.completed === filters.status;
      const descFiltering = ticketUser.description?.toLowerCase().includes(filters.description) || filters.description === '';

      // Combine the filters 
      return (assigneeFiltering.includes(filters.assignee) || filters.assignee === '') && statusFiltering && descFiltering;
    });

    if (this.dataSource.paginator) { // 
      this.dataSource.paginator.firstPage();
    }
  }

  /* DESCRIPTION FILTER */
  applyFilterDesc(filterValue: string) {
    this.filterDesc = filterValue.toLowerCase();
    this.applyFilter(this.filterAssignee, this.statusFilter, this.filterDesc);
  }

  /* USER FILTER */
  applyFilterUser(filterValue: string) {
    this.filterAssignee = filterValue;
    this.applyFilter(this.filterAssignee, this.statusFilter, this.filterDesc);
  }

  /* STATUS FILTER */
  findCompleted(filterValue: boolean) {
    this.statusFilter = filterValue;
    this.applyFilter(this.filterAssignee, this.statusFilter, this.filterDesc);
  }

  /* REINITIALIZE FILTER */
  reinitStatus() {
    this.statusFilter = null;
    this.applyFilter(this.filterAssignee, this.statusFilter, this.filterDesc);
  }

  /* GET ALL TICKETS */
  getTickets() {
    this.dataready = false;
    this.ticketslist = [];
    this.backendService.tickets1().pipe(
      catchError(error => {
        console.error('Error fetching tickets:', error);
        this.ticketNotFound = true;
        return of(null);
      })
    ).subscribe(tickets => { //récupère les tickets
      if (tickets && tickets.length > 0) {
        const donnees = tickets.map(ticket => // va boucler chaque ticket
          ticket.assigneeId !== null ? this.backendService.user(ticket.assigneeId) : of(null) // va rechercher l'utilisateur responsable du ticket si il y en a et va rassembler les observables dans une constante
        );
        forkJoin(donnees).subscribe((users: User[]) => {
          console.log(JSON.stringify(users) + " DONNEES");
          users.forEach((user, index) => {
            const ticket = tickets[index];
            const ticketUser = new TicketUser(
              ticket.id,
              ticket.completed ? ticket.completed : false,
              user as User | null,
              ticket.description
            );
            console.log(ticketUser);
            this.ticketslist.push(ticketUser);
          });
          this.dataready = true;
          this.dataSource.data = this.ticketslist;
          this.dataSource.paginator = this.paginator;
        });
      } else {
        this.ticketNotFound = true;
      }
    });
  }

  openform(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const diag = this.dialog.open(AddticketDialogComponent, {
      width: '500px',
      height: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    diag.afterClosed().subscribe(result => {
      if (result.event) {
        this.getTickets();
      } else {

      }
    });
  }

  togglefilter() {
    this.isDivHidden = !this.isDivHidden; // toggle
  }

  onButtonClick(row: any) {

  }
}
