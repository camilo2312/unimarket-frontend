import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/services-http/login.service';

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

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService  
  ) {}

  ngOnInit(): void {
    this.frmReset = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnDestroy(): void {
    
  }

  save() {
    if (this.frmReset.valid) {

    } else {
      this.frmReset.markAllAsTouched();
    }
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
