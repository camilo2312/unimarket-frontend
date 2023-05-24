import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from 'src/app/model/Estado';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { environment } from 'src/environments/environment';

type NewType = Observable<MensajeDTO>;

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.MODERATOR}`;

  constructor(private http: HttpClient) { }

  updateProductState(codeProduct: number, state: Estado): NewType {
    const urlUpdateState = `${this.urlApi}aprobar-rechazar-producto/${codeProduct}/${Estado[state]}`;
    return this.http.get<MensajeDTO>(urlUpdateState);
  }
}
