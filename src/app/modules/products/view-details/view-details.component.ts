import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { UserGetDTO } from 'src/app/model/UserGetDTO';
import { FavoriteProductService } from 'src/app/services/services-http/favorite-product.service';
import { ProductService } from 'src/app/services/services-http/product.service';
import { TokenService } from 'src/app/services/services-http/token.service';
import { UserService } from 'src/app/services/services-http/user.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {
 
  codeProduct!: number | null;
  product!: ProductGetDTO;
  destroy$ = new Subject<boolean>();
  alert!: Alert | null;
  user!: UserGetDTO | null;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private favoriteService: FavoriteProductService,
    private userService: UserService,
    private route: Router
  ) {}
 
  ngOnInit(): void {
    this.codeProduct = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getProduct();
  }

  private getProduct() {
    this.productService.getProduct(this.codeProduct).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {          
          this.product = data.respuesta;
          this.getUser(this.product.vendedor);
        }
      },
      error: error => {

      }
    })
  }

  private getUser(code: string) {
    this.userService.getUser(code).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.user = data.respuesta;
        }
      }
    });
  }

  addFavorites(product: ProductGetDTO) {
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

  isUser() {
    const role = this.tokenService.getRole();
    return role === 'CLIENTE';
  }

  isModerator() {
    const role = this.tokenService.getRole();
    return role === 'MODERADOR';
  }

  returnPage() {
    this.route.navigate(['/pages/products/approve-reject']);
  }
}
