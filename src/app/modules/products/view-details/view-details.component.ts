import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { ComentarioDTO } from 'src/app/model/ComentarioDTO';
import { ComentarioGetDTO } from 'src/app/model/ComentarioGetDTO';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { UserGetDTO } from 'src/app/model/UserGetDTO';
import { BuyService } from 'src/app/services/services-http/buy.service';
import { CommentService } from 'src/app/services/services-http/comment.service';
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
 
  codeProduct!: number;
  product!: ProductGetDTO;
  destroy$ = new Subject<boolean>();
  alert!: Alert | null;
  user!: UserGetDTO | null;
  frmComments!: FormGroup;
  lstComments = new Array<ComentarioGetDTO>();


  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private favoriteService: FavoriteProductService,
    private buyService: BuyService,
    private commentService: CommentService,
    private route: Router,
    private fb: FormBuilder
  ) {}
 
  ngOnInit(): void {
    this.frmComments =  this.fb.group({
      comment: ['', Validators.required]
    });

    this.codeProduct = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getProduct();
    this.getComments();
  }

  private getProduct() {
    this.productService.getProduct(this.codeProduct).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {          
          this.product = data.respuesta;
        }
      },
      error: error => {

      }
    })
  }

  private getComments() {
    this.commentService.getCommentsProduct(this.codeProduct).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.lstComments = data.respuesta;
        }
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

  isModerator() {
    const role = this.tokenService.getRole();
    return role === 'MODERADOR';
  }

  isLogged(): boolean {
    return this.tokenService.isLogged();
  }

  returnPage() {
    this.route.navigate(['/pages/products/approve-reject']);
  }

  get getCommentField() {
    return this.frmComments.get('comment');
  }

  createComment() {
    if (this.frmComments.valid) {
      const comment = this.mapComment();
      this.commentService.createComment(comment).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: data => {
          if (data) {
            this.alert = new Alert('Comentario creado existosamente', 'success');
            this.clearForm();
            this.getComments();
          }
        },
        error: error => {
          this.alert = new Alert(error.error.respuesta, 'danger');
        }
      });
    } else {
      this.frmComments.markAllAsTouched();
    }
  }

  private mapComment(): ComentarioDTO {
    const comment: ComentarioDTO = {
      cedulaUsuario: this.tokenService.getCodeUser(),
      codigoProducto: this.codeProduct,
      descripcion: this.getCommentField?.value
    };

    return comment;
  }

  private clearForm() {
    this.frmComments.reset();
  }
}
