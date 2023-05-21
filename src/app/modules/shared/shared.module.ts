import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { ModalComponent } from './modal/modal.component';



@NgModule({
  declarations: [
    AlertComponent,
    ModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    ModalComponent
  ]
})
export class SharedModule { }
