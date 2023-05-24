import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { CompraGetDTO } from 'src/app/model/CompraGetDTO';
import { EstadoCompra } from 'src/app/model/EstadoCompra';
import { BuyService } from 'src/app/services/services-http/buy.service';
import { TokenService } from 'src/app/services/services-http/token.service';

@Component({
  selector: 'app-list-buys',
  templateUrl: './list-buys.component.html',
  styleUrls: ['./list-buys.component.css']
})
export class ListBuysComponent implements OnInit, OnDestroy {

  lstBuys = new Array<CompraGetDTO>();
  alert!: Alert;
  destroy$ = new Subject<boolean>();
  stateBuy = EstadoCompra;

  constructor(
    private buyService: BuyService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    
  }

  private getData() {
    const codeUser = this.tokenService.getCodeUser();
    this.buyService.getLstBuys(codeUser).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.lstBuys = data.respuesta;
        }
      },
      error: error => {
        this.alert = new Alert(error.error.respuesta, 'danger');
      }
    });
  }
}
