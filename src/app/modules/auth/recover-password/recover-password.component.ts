import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { LoginService } from 'src/app/services/services-http/login.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit, OnDestroy{
 
  frmReset!: FormGroup;
  alert!: Alert;
  destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService
  ) {}


  ngOnInit(): void {
    this.frmReset = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  get getEmailField() {
    return this.frmReset.get('email');
  }

  resetPassword() {
    if (this.frmReset.valid) {
      const emial = this.getEmailField?.value;
      this.loginService.resetPassword(emial).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: data => {
          if (data) {
            this.alert = new Alert(data.respuesta, 'success');
          }
        },
        error: error => {
          this.alert = new Alert(error.error.respuesta, 'danger');
        }
      });
    } else {
      this.frmReset.markAllAsTouched();
    }
  }
}
