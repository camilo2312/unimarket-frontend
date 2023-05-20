import { Injectable, NgModuleRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/modules/shared/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NgbModal) { }

  openModal(title: string, message: string): NgbModalRef {
    const ref = this.modalService.open(ModalComponent, {
      centered: true,
      animation: true,
      backdrop: 'static',
      keyboard: false
    });

    ref.componentInstance.title = title;
    ref.componentInstance.message = message;

    return ref;
  }
}
