import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesGuard } from 'src/app/guards/roles.service';
import { ApproveRejectProductsComponent } from './approve-reject-products/approve-reject-products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ListFavoritesComponent } from './list-favorites/list-favorites.component';
import { ListProductsUsersComponent } from './list-products-users/list-products-users.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

const routes: Routes = [
  { path: 'create-product', component: CreateProductComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["CLIENTE"] } },
  { path: 'create-product/:id', component: CreateProductComponent, canActivate:
  [RolesGuard], data: { expectedRole: ["CLIENTE"] } },
  { path: 'list-products-user', component: ListProductsUsersComponent, canActivate:
  [RolesGuard], data: { expectedRole: ["CLIENTE"] } },
  { path: 'view-details/:id', component: ViewDetailsComponent },
  { path: 'favorites', component: ListFavoritesComponent, canActivate:
  [RolesGuard], data: { expectedRole: ["CLIENTE"] } },
  { path: 'approve-reject', component: ApproveRejectProductsComponent, canActivate: [RolesGuard],
  data: { expectedRole: ["MODERADOR"] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
