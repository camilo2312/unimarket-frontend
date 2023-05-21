import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { CreateProductComponent } from './create-product/create-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ListProductsUsersComponent } from './list-products-users/list-products-users.component';
import { ListProductsModeratorComponent } from './list-products-moderator/list-products-moderator.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { ListFavoritesComponent } from './list-favorites/list-favorites.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ApproveRejectProductsComponent } from './approve-reject-products/approve-reject-products.component';


@NgModule({
  declarations: [
    CreateProductComponent,
    ListProductsUsersComponent,
    ListProductsModeratorComponent,
    ViewDetailsComponent,
    ListFavoritesComponent,
    ApproveRejectProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsModule { }
