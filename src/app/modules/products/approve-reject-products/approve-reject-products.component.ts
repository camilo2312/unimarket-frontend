import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { Estado } from 'src/app/model/Estado';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { ModalService } from 'src/app/services/services-core/modal.service';
import { ModeratorService } from 'src/app/services/services-http/moderator.service';
import { ProductService } from 'src/app/services/services-http/product.service';

@Component({
  selector: 'app-approve-reject-products',
  templateUrl: './approve-reject-products.component.html',
  styleUrls: ['./approve-reject-products.component.css']
})
export class ApproveRejectProductsComponent implements OnInit, OnDestroy {

  lstProducts = new Array<ProductGetDTO>();
  destroy$ = new Subject<boolean>();
  alert!: Alert | null;

  constructor(
    private productService: ProductService,
    private moderatorService: ModeratorService,
    private route: Router,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getData() {
    this.productService.getProductsModerator().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.lstProducts = data.respuesta;
        }
      },
      error: error => {
        this.alert = new Alert(error.error.respuesta, 'danger');
      }
    });
  }

  approveProduct(product: ProductGetDTO) {
    this.modalService.openModal(
      'Aprobar',
      '¿Está sgeuro de aprobar el producto?'
    ).result
    .then((response) => {
      if (response) {
        this.updatestateProduct(product.codigo, Estado.AUTORIZADO);
      }
    });
  }

  rejectProduct(product: ProductGetDTO) {
    this.modalService.openModal(
      'Rechazar',
      '¿Está sgeuro de rechazar el producto?'
    ).result
    .then((response) => {
      if (response) {
        this.updatestateProduct(product.codigo, Estado.RECHAZADO);
      }
    });
  }

  private updatestateProduct(codeProduct: number, state: Estado) {
    this.moderatorService.updateProductState(codeProduct, state).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data && data.respuesta) {
          const index = this.lstProducts.findIndex(x => x.codigo === codeProduct);
          this.lstProducts.splice(index, 1);
          this.alert = new Alert('Producto actualizado correctamente', 'success');
        }
      },
      error: error => {
        this.alert = new Alert(error.error.respuesta, 'danger');
      }
    });
  }

  viewDetails(product: ProductGetDTO) {
    this.route.navigate([`/pages/products/view-details/${product.codigo}`]);
  }
 
}
