import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingRoutingModule } from './shopping-routing.module';
import { BuysComponent } from './buys/buys.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListBuysComponent } from './list-buys/list-buys.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    BuysComponent,
    ListBuysComponent
  ],
  imports: [
    CommonModule,
    ShoppingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule
  ]
})
export class ShoppingModule { }
