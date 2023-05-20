import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { ListFavoritesComponent } from './list-favorites/list-favorites.component';
import { ListProductsUsersComponent } from './list-products-users/list-products-users.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

const routes: Routes = [
  { path: 'create-product', component: CreateProductComponent },
  { path: 'create-product/:id', component: CreateProductComponent },
  { path: 'list-products-user', component: ListProductsUsersComponent },
  { path: 'view-details/:id', component: ViewDetailsComponent },
  { path: 'favorites', component: ListFavoritesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
