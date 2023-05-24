import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { BuyService } from 'src/app/services/services-http/buy.service';
import { FavoriteProductService } from 'src/app/services/services-http/favorite-product.service';
import { ProductService } from 'src/app/services/services-http/product.service';
import { TokenService } from 'src/app/services/services-http/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  lstProducts = new Array<ProductGetDTO>();
  destroy$ = new Subject<boolean>();
  alert!: Alert | null;

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteProductService,
    private tokenService: TokenService,
    private buyService: BuyService,
    private route: Router  
  ) {}

  ngOnInit(): void {    
    this.getData();  
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
  private getData() {
    this.productService.getAllProducts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.lstProducts = data.respuesta;
        }
      },
      error: error => {

      }
    });
  }

  addFavorites(product: ProductGetDTO) {
    if (this.tokenService.isLogged()) {
      this.addFavoriteUser(product);
    } else {
      this.route.navigate(['/auth/login']);
    }
  }

  private addFavoriteUser(product: ProductGetDTO) {
    const codeUser = this.tokenService.getCodeUser();
    this.favoriteService.createFavoriteUser(codeUser, product.codigo).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data && data.respuesta) {
          this.alert = new Alert('Producto añadido correctamente', 'success');
        } else {
          this.alert = new Alert('El producto ya esta en la lista de favoritos', 'warning');
        }

        setTimeout(() => {
          this.alert = null;
        }, 1300);
      },
      error: error => {

      }
    });
  }

  addCart(product: ProductGetDTO) {
    if (this.tokenService.isLogged()) {
      this.addCartUser(product);
      this.alert = new Alert('Producto agregado correctamente', 'success');
      setTimeout(() => {
        this.alert = null;
      }, 2000);
    } else {
      this.route.navigate(['/auth/login']);
    }
  }

  private addCartUser(product: ProductGetDTO) {
    const productFind = this.buyService.getLstProducts.find(x => x.codigo === product.codigo);
    if (!productFind) {
      this.buyService.newProduct(product);
    } else {
      this.alert = new Alert('El producto ya se esta agregado en el carrito', 'warning');
      setTimeout(() => {
        this.alert =  null;
      }, 2000);
    }
  }

  viewDetails(code: number) {
    this.route.navigate([`/pages/products/view-details/${code}`]);
  }
} 
