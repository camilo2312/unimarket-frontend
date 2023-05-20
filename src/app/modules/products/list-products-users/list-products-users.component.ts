import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { ProductDTO } from 'src/app/model/ProductDTO';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { ModalService } from 'src/app/services/services-core/modal.service';
import { ProductService } from 'src/app/services/services-http/product.service';
import { TokenService } from 'src/app/services/services-http/token.service';

@Component({
  selector: 'app-list-products-users',
  templateUrl: './list-products-users.component.html',
  styleUrls: ['./list-products-users.component.css']
})
export class ListProductsUsersComponent implements OnInit, OnDestroy {

  name: string | null | undefined;
  lstProducts = new Array<ProductGetDTO>();
  private codeUser = '';
  destroy$ = new Subject<boolean>();
  alert!: Alert;

  constructor(
    private productsService: ProductService,
    private tokenService: TokenService,
    private route: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('user');
    this.codeUser = this.tokenService.getCodeUser();
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getData() {
    this.productsService.getProductsUser(this.codeUser).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.lstProducts = data.respuesta;
        }
      }
    });
  }

  deleteProduct(product: ProductGetDTO) {
    if (product) {
      this.modalService.openModal(
        'Eliminar',
        '¿Está seguro de eliminar el producto?'
      ).result
      .then((response) => {
        if (response) {
          this.productsService.deleteProduct(product.codigo).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: data => {
              if (data) {
                const index = this.lstProducts.findIndex(x => x.codigo === product.codigo);
                this.lstProducts.splice(index, 1);
                this.alert = new Alert('Producto eliminado correctamente', 'success');
              }
            },
            error: error => {
              this.alert = new Alert(error.error, 'danger');
            }
          });
        }
      });
    }
  }

  editProduct(product: ProductGetDTO) {
    if (product) {
      this.route.navigate([`/pages/products/create-product/${product.codigo}`]);
    }
  }

  goToCreateProduct() {
    this.route.navigate(['/pages/products/create-product']);
  }
}
