import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoriteProductService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.FAVORITE_USER}`;

  constructor(private http: HttpClient) { }

  createFavoriteUser(codeUser: string, codeProduct: number): Observable<MensajeDTO> {
    const urlSaveFavorite = `${this.urlApi}crearFavorito`;
    const favoriteDTO = {
      cedulaUsuario: codeUser,
      codigoProducto: codeProduct
    };
    return this.http.post<MensajeDTO>(urlSaveFavorite, favoriteDTO);
  }

  deleteFavoriteUser(codeUser: string, codeProduct: number): Observable<MensajeDTO> {
    const urlDelete = `${this.urlApi}eliminarFavorito`;
    const favoriteDTO = {
      cedulaUsuario: codeUser,
      codigoProducto: codeProduct
    };
    return this.http.post<MensajeDTO>(urlDelete, favoriteDTO);
  }
}
