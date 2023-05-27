import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';

const TOKEN_KEY = "AuthToken";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router) { }

  private setToken(token: string) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean {
    if (this.getToken()) {
    return true;
    }
    return false;
  }

  public login(token:string){
    this.setToken(token);
    if (this.getRole() === 'CLIENTE') {
      this.router.navigate(['/pages/home']);
    } else {
      this.router.navigate(['/pages/products/approve-reject']);
    }
  }

  public logout() {
    window.sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  public getEmail(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.sub;
    }

    return '';
  }

  public getCodeUser(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.sub_code;
    }

    return '';
  }

  public getRole(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.roles[0];
    }

    return '';
  }

  private decodePayload(token: string): any {
    const payload = token!.split('.')[1];
    const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
    const values = JSON.parse(payloadDecoded);
    return values;
  }
}
