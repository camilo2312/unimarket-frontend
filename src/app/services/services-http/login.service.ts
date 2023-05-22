import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionDTO } from 'src/app/model/SessionDTO';
import { TokenDTO } from 'src/app/model/TokenDTO';
import { MensajeDTO } from 'src/app/model/MensajeDTO';

@Injectable({
  providedIn: 'root'  
})
export class LoginService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.LOGIN}`;
  private messageSource = new BehaviorSubject<any>(0);
  currentMessage: Observable<any>;

  constructor(private http: HttpClient) { 
    this.currentMessage = this.messageSource.asObservable();
  }

  login(sesionDTO: SessionDTO): Observable<MensajeDTO> {
    const urlLogin = `${this.urlApi}login`;
    return this.http.post<MensajeDTO>(urlLogin, sesionDTO);
  }

  refresh(TokenDTO: TokenDTO): Observable<TokenDTO> {
    const urlLogin = `${this.urlApi}refresh`;
    return this.http.post<TokenDTO>(urlLogin, TokenDTO);
  }
}
