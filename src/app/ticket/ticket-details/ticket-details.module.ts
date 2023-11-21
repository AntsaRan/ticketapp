import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketDetailsComponent } from './ticket-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [TicketDetailsComponent],
  imports: [
    CommonModule,MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,MatSelectModule,
    MatAutocompleteModule,FormsModule,
    MatFormFieldModule,MatCardModule,
    ReactiveFormsModule


    
  ]
})
export class TicketDetailsModule { }
