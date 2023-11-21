import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, Subject, catchError, concatMap, forkJoin, map, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddticketDialogComponent } from '../addticket-dialog/addticket-dialog.component';
import { TicketUser } from 'src/app/data-access/model/ticketUser';
import { Store, select } from '@ngrx/store';
import { getListTicketsOnInit } from 'src/app/data-access/state/ticket.actions';
import { checkDataReady, getTickets } from 'src/app/data-access/state/ticket.selector';

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
  ticketslist$: Observable<TicketUser[]>;
  dataready = false;
  isListReady$ : Observable<boolean>;
  dataSource: MatTableDataSource<TicketUser>;
  ticketIsAdded = false;
  addticketmessage = "";
  // FILTERS
  filterAssignee: string = "";
  filterDesc: string = "";
  statusFilter: boolean | null = null;
  filters = { assignee: null, status: null, description: null };
  //DETAILS
  ticketID: number | null = null;

  private destroy$ = new Subject<boolean>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private store: Store

  ) { }

  ngOnInit(): void {
    //this.store.dispatch(getListTicketsOnInit());
    this.getTickets1();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {

  }
  
  getTickets1() {
    this.store.dispatch(getListTicketsOnInit());
    this.ticketslist$ = this.store.pipe(select(getTickets));
    this.ticketslist$.subscribe((tickets: TicketUser[]) => {
      if (tickets.length > 0) {
        this.dataSource = new MatTableDataSource(tickets);
        this.dataready = true;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
    this.isListReady$ = this.store.pipe(select(checkDataReady));

  }

  getFilters(event) {
    this.filters = event;
    this.applyFilter();

  }

  applyFilter() {
    this.ticketslist$.subscribe((tickets: TicketUser[]) => {
      this.dataSource.data = tickets.filter((ticketUser: TicketUser) => {
        const assigneeFiltering = ticketUser.user?.name?.toLowerCase() || '-';
        const statusFiltering = this.filters.status === null || ticketUser.completed === this.filters.status;
        const descFiltering = ticketUser.description?.toLowerCase().includes(this.filters.description) || this.filters.description === '';
        // Combine the filters 
        return (assigneeFiltering.includes(this.filters.assignee) || this.filters.assignee === '') && statusFiltering && descFiltering;
      });

      if (this.dataSource.paginator) { // 
        this.dataSource.paginator.firstPage();
      }
    })

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
        this.getTickets1();
      }
    });
  }



}
