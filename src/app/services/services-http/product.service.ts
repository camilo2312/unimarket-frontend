import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from 'src/app/model/Estado';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { ProductDTO } from 'src/app/model/ProductDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.PRODUCT}`;

  constructor(private http: HttpClient) { }

  createProduct(productDTO: ProductDTO): Observable<MensajeDTO> {
    const urlSaveProduct = `${this.urlApi}`;
    return this.http.post<MensajeDTO>(urlSaveProduct.substring(0, urlSaveProduct.length - 1), productDTO);
  }
  
  getProductsUser(code: string): Observable<MensajeDTO> {
    const urlGetProducts = `${this.urlApi}productosVendedor/${code}`;
    return this.http.get<MensajeDTO>(urlGetProducts);
  }

  deleteProduct(code: number): Observable<MensajeDTO> {
    const urlDelete = `${this.urlApi}${code}`;
    return this.http.delete<MensajeDTO>(urlDelete);
  }
  
  getProduct(code: number | null): Observable<MensajeDTO> {
    const urlGetProduct = `${this.urlApi}obtenerProducto/${code}`;
    return this.http.get<MensajeDTO>(urlGetProduct);
  }

  updateProduct(code: number | null, product: ProductDTO): Observable<MensajeDTO> {
    const urlUpdateProduct = `${this.urlApi}actualizarProducto/${code}`;
    return this.http.put<MensajeDTO>(urlUpdateProduct, product);
  }

  getAllProducts(): Observable<MensajeDTO> {
    const urlAllProducts = `${this.urlApi}allProductos`;
    return this.http.get<MensajeDTO>(urlAllProducts);
  }

  getFavoriteProducts(codeUser: string): Observable<MensajeDTO> {
    const urlGetFavoriteProducts = `${this.urlApi}favoritos/${codeUser}`;
    return this.http.get<MensajeDTO>(urlGetFavoriteProducts);
  }

  getProductsModerator(): Observable<MensajeDTO> {
    const urlGetProductsModerator = `${this.urlApi}allProductosModerator`;
    return this.http.get<MensajeDTO>(urlGetProductsModerator);
  }

  updateProductState(codeProduct: number, state: Estado): Observable<MensajeDTO> {
    const urlUpdateState = `${this.urlApi}actualizarEstado/${codeProduct}/${Estado[state]}`;
    return this.http.get<MensajeDTO>(urlUpdateState);
  }
}
