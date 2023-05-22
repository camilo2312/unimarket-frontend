import { Injectable } from '@angular/core';
import {
HttpRequest,
HttpHandler,
HttpEvent,
HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services-http/token.service';

const AUTHORIZATION = "Authorization";
const BEARER = "Bearer ";
@Injectable()
export class UsuarioInterceptor implements HttpInterceptor {
constructor(private tokenService: TokenService) { }
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
const isApiUrl = req.url.includes("api/auth");
if (!this.tokenService.isLogged() || isApiUrl) {
return next.handle(req);
}
let initReq = req;
let token = this.tokenService.getToken();
initReq = this.addToken(req, token!);
return next.handle(initReq);
}
private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({ headers: req.headers.set(AUTHORIZATION, BEARER + token) });
  }
  }