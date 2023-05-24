import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/services-http/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private route: Router,
    public tokenService: TokenService
  ) {}
  
  ngOnInit(): void {
    
  }

  goToLogin() {
    this.route.navigate(['/auth/login']);
  }

  goToRegister() {
    this.route.navigate(['/auth/register-user']);
  }

  logout() {
    this.tokenService.logout();
  }

  isUser() {
    const role = this.tokenService.getRole();
    return this.tokenService.isLogged() && role === 'CLIENTE';
  }

  isModerator() {
    const role = this.tokenService.getRole();
    return this.tokenService.isLogged() && role === 'MODERADOR';
  }

  getEmail(): string {
    return this.tokenService.getEmail();
  }

  gotToCart() {
    this.route.navigate(['/pages/shopping/cart']);
  }
}
