import { Component } from '@angular/core';
import { BackendService } from '../../backend.service';
import { Ticket } from 'src/interfaces/ticket.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-addticket-dialog',
  templateUrl: './addticket-dialog.component.html',
  styleUrls: ['./addticket-dialog.component.css']
})
export class AddticketDialogComponent {

  ticketIsAdded = false;
  errorinsert = false;
  errormessage = "An error occured, please try again.";
  sucessmessage = "Successfully added!";
  addticketmessage = "";
  descriptionTicket: string = "";
  inprogress = false;
  isFormValid = false;
  newticket : Ticket = null;
  
  constructor(private backendService: BackendService, private dialogRef: MatDialogRef<AddticketDialogComponent>
  ) {

  }
  add_ticket() {
    this.inprogress = true;
    if (this.descriptionTicket != "") {
      const ticket: any =
      {
        description: this.descriptionTicket,
      };
      this.backendService.newTicket1(ticket).pipe(
        catchError(error => {
          console.error('Error adding ticket:', error);
          this.errorinsert = true;
          return of(null);
        })
      ).subscribe(newticket => {
        if (newticket) {
          this.newticket=newticket;
          this.inprogress = !this.inprogress;
          this.ticketIsAdded = true;
          setTimeout(() => {
            this.dialogRef.close({ event: this.ticketIsAdded });
            this.ticketIsAdded = false;
          }, 1000);
        } else {
          this.inprogress = !this.inprogress;
          this.errorinsert = true;
          setTimeout(() => {
            this.errorinsert = false;
            this.dialogRef.close({ event: this.ticketIsAdded });
          }, 1000);
        }
      })
    }
  }
}
