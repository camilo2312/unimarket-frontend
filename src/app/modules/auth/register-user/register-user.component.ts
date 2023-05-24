import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { DireccionDTO } from 'src/app/model/DireccionDTO';
import { UserDTO } from 'src/app/model/UserDTO';
import { ModalService } from 'src/app/services/services-core/modal.service';
import { AddressService } from 'src/app/services/services-http/address.service';
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
    private addressService: AddressService,
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
      password: ['', [Validators.required, Validators.min(8)]],
      street: ['', Validators.required],
      postalCode: ['', Validators.required]
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

  get getStreetField() {
    return this.frmRegister.get('street');
  }

  get getPostalCodeField() {
    return this.frmRegister.get('postalCode');
  }

  save() {
    if (this.frmRegister.valid) {
      const userDTO = this.mapUser();
      this.userService.createUser(userDTO).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: data => {
          if (data) {
            this.createAddress();
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

  private createAddress() {
    const address = this.mapDireccion();
    this.addressService.createAddress(address).pipe(
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
  }

  private clearForm() {
    this.frmRegister.reset();
  }

  private mapUser(): UserDTO {
    const user: UserDTO = {
      cedula: this.getCodeField?.value,
      nombreCompleto: this.getNameField?.value,
      email: this.getEmailField?.value,
      numeroTelefono: this.getPhoneField?.value,
      contrasena: this.getPasswordField?.value,
      nombreUsuario: this.getUserNameField?.value
    };

    return user;
  }

  private mapDireccion(): DireccionDTO {
    const direccion: DireccionDTO = {
      cedulaUsuario: this.getCodeField?.value,
      codigoPostal: this.getPostalCodeField?.value,
      descripcion: this.getStreetField?.value
    };

    return direccion;
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
