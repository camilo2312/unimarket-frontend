import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DireccionDTO } from 'src/app/model/DireccionDTO';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.ADDRESS}`;

  constructor(private http: HttpClient) { }

  createAddress(address: DireccionDTO): Observable<MensajeDTO> {
    const urlSave = `${this.urlApi}`;
    return this.http.post<MensajeDTO>(urlSave.substring(0, urlSave.length - 1), address);
  }
}
