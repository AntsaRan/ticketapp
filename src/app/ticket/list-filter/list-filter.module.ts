import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFilterComponent } from './list-filter.component';
import { MatInputModule } from '@angular/material/input';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ListFilterComponent],
  imports: [
    CommonModule,
    MatInputModule,
    BrowserAnimationsModule
  ]
})
export class ListFilterModule { }
