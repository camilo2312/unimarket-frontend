import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CompraDTO } from 'src/app/model/CompraDTO';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.BUY}`;
  private arrayProductsCart = new Array<ProductGetDTO>();
  private newProductCart = new Subject<ProductGetDTO>();

  constructor(private http: HttpClient) { }

  createBuy(compraDTO: CompraDTO): Observable<MensajeDTO> {
    const urlCreateBuy = `${this.urlApi}`;
    return this.http.post<MensajeDTO>(urlCreateBuy.substring(0, urlCreateBuy.length - 1), compraDTO);
  }

  newProduct(product: ProductGetDTO) {
    this.arrayProductsCart.push(product);
  }

  getLstBuys(code: string): Observable<MensajeDTO> {
    const urlGetBuysUser = `${this.urlApi}comprasUsuario/${code}`;
    return this.http.get<MensajeDTO>(urlGetBuysUser);
  }
  
  get getLstProducts(): Array<ProductGetDTO> {
    return this.arrayProductsCart;
  }
}
