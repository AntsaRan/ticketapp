import { Component, EventEmitter, Output } from '@angular/core';
import { TicketUser } from '../../data-access/model/ticketUser';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.css'],
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
export class ListFilterComponent {
  @Output() filtersData = new EventEmitter<any>();
  isDivHidden = true;
  completed = false;
  reinit = false;
  filters = { assignee: null, status: null, description: null };
  filterAssignee: string = "";
  filterDesc: string = "";
  statusFilter: boolean | null = null;

  applyFilter(assigneeFilterValue: string, statusFilterValue: boolean | null, descFilterValue: string) {
    this.filters = {
      assignee: assigneeFilterValue.trim().toLowerCase(),
      status: statusFilterValue,
      description: descFilterValue.trim().toLowerCase()
    };
    this.filtersData.emit(this.filters);
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
  togglefilter() {
    console.log("TOOGGLE")
    this.isDivHidden = !this.isDivHidden; // toggle
  }
}
