import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { SessionDTO } from 'src/app/model/SessionDTO';
import { LoginService } from 'src/app/services/services-http/login.service';
import { TokenService } from 'src/app/services/services-http/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  frmLogin!: FormGroup;
  destroy$ = new Subject<boolean>();
  alert!: Alert;

  constructor(
      private fb: FormBuilder,
      private loginService: LoginService,
      private route: Router,
      private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.frmLogin = this.fb.group({
      user: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  get getUserField() {
    return this.frmLogin.get('user');
  }

  get getPasswordField() {
    return this.frmLogin.get('password');
  }

  login() {
    if (this.frmLogin.valid) {
      const sesionDTO = this.mapSession();
      this.loginService.login(sesionDTO).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: data => {
          if (data) {
            this.tokenService.login(data.respuesta.token);
          }
        },
        error: error => {
          this.alert = new Alert(error.error.respuesta, 'danger');
        }
      });
    } else {
      this.frmLogin.markAllAsTouched();
    }
  }

  private mapSession(): SessionDTO {
    const session: SessionDTO = {
      email: this.frmLogin.get('user')?.value,
      password: this.frmLogin.get('password')?.value
    }
    return session;
  }
}
