import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { ProductDTO } from 'src/app/model/ProductDTO';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { ModalService } from 'src/app/services/services-core/modal.service';
import { FavoriteProductService } from 'src/app/services/services-http/favorite-product.service';
import { ProductService } from 'src/app/services/services-http/product.service';
import { TokenService } from 'src/app/services/services-http/token.service';

@Component({
  selector: 'app-list-favorites',
  templateUrl: './list-favorites.component.html',
  styleUrls: ['./list-favorites.component.css']
})
export class ListFavoritesComponent implements OnInit, OnDestroy {

  lstProducts = new Array<ProductGetDTO>();
  alert!: Alert | null;
  destroy$ = new Subject<boolean>();
  allCheck = false;
  indeterminate!: boolean | undefined;
  codeUser = '';

  constructor(
    private tokenService: TokenService,
    private productService: ProductService,
    private productFavoriteService: FavoriteProductService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.codeUser = this.tokenService.getCodeUser();
    this.getFavoriteProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getFavoriteProducts() {
    this.productService.getFavoriteProducts(this.codeUser).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.lstProducts = data.respuesta;
          this.lstProducts.forEach(x => x.seleccion = false);
        }
      },
      error: error => {
        this.alert = new Alert(error.error.respuesta, 'danger');
      }
    });
  }

  selectedAll(event: Event) {
    this.lstProducts.forEach(x => x.seleccion = this.allCheck);
    if (!this.allCheck) {
      this.indeterminate = false;
    }
  }

  selectedProduct(event: Event, selected: boolean | undefined) {
    this.indeterminate = selected;
  }

  deleteProducts() {
    const lstDeleteProducts = this.lstProducts.filter(x => x.seleccion);
    if (lstDeleteProducts.length > 0) {
      this.modalService.openModal(
        'Eliminar',
        '¿Está seguro de eliminar los registros seleccionados?'
      ).result
      .then((response) => {
        if (response) {
          lstDeleteProducts.forEach(product => {
            this.productFavoriteService.deleteFavoriteUser(this.codeUser, product.codigo).pipe(
              takeUntil(this.destroy$)
            ).subscribe({
              next: data => {
                if (data) {
                  const index = this.lstProducts.findIndex(x => x.codigo === product.codigo);
                  this.lstProducts.splice(index, 1);
                  this.clear();
                }
              },
              error: error => {
                this.alert =  new Alert(error.error.respuesta, 'danger');            
              }
            });
          });
          this.alert = new Alert('Productos eliminados correctamente', 'success');
        }
      });
    }
  }

  deleteOneProduct(product: ProductGetDTO) {
    if (product) {
      this.modalService.openModal(
        'Eliminar',
        '¿Está seguro de eliminar el registro?'
      ).result
      .then((response) => {
        if (response) {
          this.productFavoriteService.deleteFavoriteUser(this.codeUser, product.codigo).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: data => {
              if (data) {
                const index = this.lstProducts.findIndex(x => x.codigo === product.codigo);
                this.lstProducts.splice(index, 1);
                this.alert =  new Alert('Producto eliminado correctamente', 'success');
                this.clear();
              }
            },
            error: error => {
              this.alert =  new Alert(error.error.respuesta, 'success');
            }
          });
        }
      });
    }
  }

  private clear() {
    this.allCheck = false;
    this.indeterminate = false;
  }
}
