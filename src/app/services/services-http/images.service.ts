import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.IMAGES}`;

  constructor(private http: HttpClient) { }

  upload(imagen: FormData): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.urlApi}upload`, imagen);
  }

  delete(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.urlApi}${id}`);
  }
}
