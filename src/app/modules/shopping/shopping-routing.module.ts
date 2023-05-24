import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuysComponent } from './buys/buys.component';
import { ListBuysComponent } from './list-buys/list-buys.component';

const routes: Routes = [
  { path: 'cart', component: BuysComponent },
  { path: 'list-buys', component: ListBuysComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule { }
