import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { UserDTO } from 'src/app/model/UserDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.USER}`;

  constructor(private http: HttpClient) { }

  createUser(user: UserDTO): Observable<MensajeDTO> {
    const urlCreateUser = `${this.urlApi}`;
    return this.http.post<MensajeDTO>(urlCreateUser.substring(0, urlCreateUser.length - 1), user);
  }

  getUser(code: string): Observable<MensajeDTO> {
    const urlGetUser = `${this.urlApi}${code}`;
    return this.http.get<MensajeDTO>(urlGetUser);
  }

  changePassword(code: string, password: string): Observable<MensajeDTO> {
    const urlChangePass = `${this.urlApi}cambiarContrasena/${code}/${password}`;
    return this.http.get<MensajeDTO>(urlChangePass);
  }
}
