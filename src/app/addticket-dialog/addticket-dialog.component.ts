import { Component } from '@angular/core';
import { BackendService } from '../backend.service';
import { Ticket } from 'src/interfaces/ticket.interface';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-addticket-dialog',
  templateUrl: './addticket-dialog.component.html',
  styleUrls: ['./addticket-dialog.component.css']
})
export class AddticketDialogComponent {

  ticketIsAdded = false;
  errorinsert = false;
  errormessage = "Une erreur s'est produite, veuillez réessayer.";
  sucessmessage = "Ajout effectué!";
  addticketmessage = "";
  descriptionTicket: string = "";
  inprogress = false;

  constructor(private backendService: BackendService, private dialogRef: MatDialogRef<AddticketDialogComponent>
  ) {

  }
  add_ticket() {
    this.inprogress = true;
    console.log(this.descriptionTicket + "description ticket");
    if (this.descriptionTicket != "") {
      const ticket: any =
      {
        description: this.descriptionTicket,
      };
      this.backendService.newTicket(ticket)
        .subscribe(newticket => {
          if (newticket) {
            this.inprogress = !this.inprogress;
            this.ticketIsAdded = true;
            setTimeout(() => {
              this.dialogRef.close({ event: this.ticketIsAdded });
              this.ticketIsAdded = false;
            }, 2000);
          } else {
            this.inprogress = !this.inprogress;
            this.errorinsert = true;
            setTimeout(() => {
              this.errorinsert = false;
              this.dialogRef.close({ event: this.ticketIsAdded });
            }, 2000);
          }
        })
    }
  }
}
