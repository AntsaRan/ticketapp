import { BackendService } from '../backend.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketUser } from 'src/app/model/ticketUser';
import { User } from 'src/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table'; // Assurez-vous d'importer le module MatTableModule
import { concatMap, forkJoin } from 'rxjs';
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private backendService: BackendService,
    private router: Router, private dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  ngOnInit(): void {
    this.getTickets();
    this.dataSource = new MatTableDataSource(this.ticketslist);

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilterUser(filterValue: string) {
    this.dataSource.filterPredicate = (ticketUser: TicketUser, filter: string) => {
      const userName = ticketUser.user?.name.toLowerCase() || '-'; // Vérifier si user est défini pour éviter les erreurs si l'utilisateur n'est pas assigné
      return userName.includes(filter);
    };
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  findCompleted() {

  }
  findUndone() {

  }
  getTickets() {
    this.dataready = false;
    this.ticketslist = [];
    this.backendService.tickets().subscribe(tickets => { //récupère les tickets
      if (tickets) {
        const donnees = tickets.map(ticket => // va boucler chaque ticket
          ticket.assigneeId !== null ? this.backendService.user(ticket.assigneeId) : of(null) // va rechercher l'utilisateur responsable du ticket et fa rassembler les observables dans une constante
        );
        forkJoin(donnees).subscribe((users: User[]) => {
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
          console.log(JSON.stringify(this.dataSource.data) + " DATA SourCE DATAAA");
          this.dataSource.paginator = this.paginator;
        });
      }
    });
  }


  getUserById(id: number): User {
    let userFound;
    this.backendService.user(id)
      .subscribe(user => {
        if (user) {
          userFound = user;
        }
      })
    return userFound;
  }

  openform(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const diag = this.dialog.open(AddticketDialogComponent, {
      width: '500px',
      height: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    diag.afterClosed().subscribe(result => {
      console.log(result);
      if (result.event) {
        console.log(" NETY");
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
