import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { CompraDTO } from 'src/app/model/CompraDTO';
import { DetalleCompraDTO } from 'src/app/model/DetalleCompraDTO';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { ModalService } from 'src/app/services/services-core/modal.service';
import { BuyService } from 'src/app/services/services-http/buy.service';
import { TokenService } from 'src/app/services/services-http/token.service';

@Component({
  selector: 'app-buys',
  templateUrl: './buys.component.html',
  styleUrls: ['./buys.component.css']
})
export class BuysComponent implements OnInit {
  
  frmBuys!: FormGroup;
  destroy$ = new Subject<boolean>();
  lstProducts = new Array<ProductGetDTO>();
  totalOrder = 0;
  alert!: Alert | null;

  constructor(
    private fb: FormBuilder,
    private buyService: BuyService,
    private modalService: ModalService,
    private tokenService: TokenService
  ) {}
  
  ngOnInit(): void {
    this.frmBuys = this.fb.group({
      paymentMethod: ['EFECTIVO', Validators.required]
    });

    this.getData();    
  }

  private getData() {
    this.lstProducts =  this.buyService.getLstProducts;
    this.calculateTotal();
  }

  save() {
    if (this.frmBuys.valid) {
      this.modalService.openModal(
        'Comprar',
        '¿Está seguro de realizar la compra?'
      ).result
      .then((response) => {
        if (response) {
          const compraDTO = this.mapCompraDTO();
          this.buyService.createBuy(compraDTO).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
            next: data => {
              if (data && data.respuesta) {
                this.alert = new Alert('Compra realizada exitosamente', 'success');
                this.clearForm();
              }
            },
            error: error => {
              this.alert = new Alert(error.error.respuesta, 'danger');
            }
          });
        }
      });
    } else {
      this.frmBuys.markAllAsTouched();
    }
  }

  private mapCompraDTO(): CompraDTO {
    const compraDTO: CompraDTO = {
      codigoUsuario: this.tokenService.getCodeUser(),
      medioPago: this.frmBuys.get('paymentMethod')?.value,
      total: this.totalOrder,
      detalleComprasDTO: this.mapDetailsCompra()
    };

    return compraDTO;
  }

  private mapDetailsCompra(): Array<DetalleCompraDTO> {
    const array = new Array<DetalleCompraDTO>();
    if (this.lstProducts && this.lstProducts.length > 0) {
      this.lstProducts.forEach(x => {
        const newDetail: DetalleCompraDTO = {
          codigoProducto: x.codigo,
          precioProducto: x.precio,
          unidades: x.quantity
        };

        array.push(newDetail);
      });
    }

    return array;
  }

  calculatePrice(product: ProductGetDTO) {
    if (product) {      
      product.totalProduct = (product.quantity ? product.quantity : 0) * product.precio;

      this.calculateTotal();
    }
  }

  private calculateTotal() {
    this.totalOrder = 0;
    this.lstProducts.forEach(x => {
      this.totalOrder = this.totalOrder + (x.totalProduct ? x.totalProduct : 0);
    });
  }

  deleteProduct(product: ProductGetDTO) {
    this.modalService.openModal(
      'Eliminar',
      '¿Está seguro de eliminar el producto?'
    ).result
    .then((response) => {
      if (response) {
        const index = this.lstProducts.findIndex(x => x.codigo === product.codigo);
        this.lstProducts.splice(index, 1);
        this.calculateTotal();
      }
    });
  }

  private clearForm() {
    this.frmBuys.reset();
    this.lstProducts = [];
  }
}
