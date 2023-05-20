import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { UserDTO } from 'src/app/model/UserDTO';
import { ModalService } from 'src/app/services/services-core/modal.service';
import { UserService } from 'src/app/services/services-http/user.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit, OnDestroy, AfterViewInit  {

  frmRegister!: FormGroup;
  destroy$ = new Subject<boolean>();
  alert!: Alert | null;


  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private userService: UserService,
    private route: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.frmRegister = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(8)]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    this.elementRef.nativeElement.ownerDocument
        .body.style.backgroundColor = '#fff';
  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
        .body.style.backgroundColor = '#e5dede';
  }

  get getCodeField() {
    return this.frmRegister.get('code');
  }

  get getNameField() {
    return this.frmRegister.get('name');
  }

  get getUserNameField() {
    return this.frmRegister.get('userName');
  }

  get getEmailField() {
    return this.frmRegister.get('email');
  }

  get getPhoneField() {
    return this.frmRegister.get('phone');
  }

  get getPasswordField() {
    return this.frmRegister.get('password');
  }

  save() {
    if (this.frmRegister.valid) {
      const userDTO = this.mapUser();
      this.userService.createUser(userDTO).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: data => {
          if (data) {
            this.alert = new Alert('Registro realizado correctamente', 'success');
            this.clearForm();
            setTimeout(() => {
              this.route.navigate(['/auth/login']);
            }, 3000);
          }
        },
        error: error => {
          this.alert = new Alert(error.error.respuesta, 'danger');
        }
      });
    } else {
      this.frmRegister.markAllAsTouched();
    }
  }

  private clearForm() {
    this.frmRegister.reset();
  }

  private mapUser(): UserDTO {
    const user: UserDTO = {
      cedula: this.getCodeField?.value,
      nombreCompleto: this.getNameField?.value,
      email: this.getEmailField?.value,
      telefono: this.getPhoneField?.value,
      contrasena: this.getPasswordField?.value,
      nombreUsuario: this.getUserNameField?.value
    };

    return user;
  }

  cancel() {
    this.modalService.openModal(
      'Cancelar',
      '¿Está seguro de cancelar la acción?'
    ).result
    .then((response) => {
      if (response) {
        this.route.navigate(['/pages/home']);
      }
    });
  }

}
