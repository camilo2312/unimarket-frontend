import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { LoginService } from 'src/app/services/services-http/login.service';
import { UserService } from 'src/app/services/services-http/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  frmReset!: FormGroup;
  typeControl1 = 'password';
  typeControl2 = 'password';
  typeControl3 = 'password';
  iconBtn1 = false;
  iconBtn2 = false;
  iconBtn3 = false;
  codeUser!: string | null;
  alert!: Alert;
  destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.frmReset = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.codeUser = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnDestroy(): void {
    
  }

  get getNewPassField() {
    return this.frmReset.get('newPassword');
  }

  get getConfirmPassField() {
    return this.frmReset.get('newPassword');
  }

  save() {
    if (this.frmReset.valid) {
      const newPassword = this.getNewPassField?.value;
      const confirmPassword = this.getConfirmPassField?.value;
      if (newPassword === confirmPassword) {
        this.changePassword();
      } else {
        this.alert = new Alert('Las contraseñas no coinciden', 'danger');
      }
    } else {
      this.frmReset.markAllAsTouched();
    }
  }

  private changePassword() {
    this.userService.changePassword(this.codeUser ? this.codeUser : '', this.getNewPassField?.value).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data && data.respuesta) {
          this.alert = new Alert('Contraseña actualizada correctamente', 'success');
          setTimeout(() => {
            this.route.navigate(['/auth/login']);
          }, 2000);
        }
      },
      error: error => {
        this.alert = new Alert(error.error.respuesta, 'danger');
      }
    });
  }

  changeType(control: number) {
    switch(control) {
      case 1:
        this.typeControl1 = this.typeControl1 === 'password' ? 'text' : 'password';
        this.iconBtn1 = !this.iconBtn1;
        break;
      case 2:
        this.typeControl2 = this.typeControl2 === 'password' ? 'text' : 'password';
        this.iconBtn2 = !this.iconBtn2;
        break;
      case 3:
        this.typeControl3 = this.typeControl3 === 'password' ? 'text' : 'password';
        this.iconBtn3 = !this.iconBtn3;
        break;
      default:
        break;
    }
  }

}
