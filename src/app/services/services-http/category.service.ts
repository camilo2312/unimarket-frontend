import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.PRODUCT}`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<MensajeDTO> {
    const urlGetCategories = `${this.urlApi}categorias`;
    return this.http.get<MensajeDTO>(urlGetCategories);
  }
}
