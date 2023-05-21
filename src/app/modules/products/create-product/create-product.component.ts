import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Alert } from 'src/app/model/Alert';
import { Category } from 'src/app/model/Category';
import { Image } from 'src/app/model/Image';
import { ProductDTO } from 'src/app/model/ProductDTO';
import { ProductGetDTO } from 'src/app/model/ProductGetDTO';
import { ModalService } from 'src/app/services/services-core/modal.service';
import { CategoryService } from 'src/app/services/services-http/category.service';
import { ImagesService } from 'src/app/services/services-http/images.service';
import { ProductService } from 'src/app/services/services-http/product.service';
import { TokenService } from 'src/app/services/services-http/token.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  frmProduct!: FormGroup;
  lstCategories = new Array<Category>();
  lstCategoriesSelected = new Array<Category>();
  destroy$ = new Subject<boolean>();
  lstImages = new Array<Image>();
  files!: FileList;
  alert!: Alert | null;
  emailUser = '';
  noCheck = false;
  codeProduct!: number | null;
  productGetDTO: ProductGetDTO | undefined;
  nameBtn = 'Crear producto';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private imageService: ImagesService,
    private tokenService: TokenService,
    private modalService: ModalService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.frmProduct = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      quantity: [0, Validators.required],
      images: [''],
      description: ['']
    });

    this.alert = null;
    this.getCategories();
    this.emailUser = this.tokenService.getEmail();

    this.codeProduct = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (this.codeProduct) {
      this.frmProduct.get('images')?.clearValidators();
      this.getProduct();
    } else {
      this.frmProduct.get('images')?.setValidators(Validators.required);
    }
  }

  private getProduct() {
    this.productService.getProduct(this.codeProduct).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.nameBtn = 'Actualizar producto';
          this.mapProductToForm(data.respuesta);
        }
      },
      error: error => {

      }
    })
  }

  private mapProductToForm(product: ProductGetDTO) {
    this.getNameField?.setValue(product.nombre);
    this.getPriceField?.setValue(product.precio);
    this.getQuantityField?.setValue(product.disponibilidad);
    this.frmProduct.get('description')?.setValue(product.descripcion);
    this.lstImages = product.imagenes;
    product.categorias.forEach(c => {
      this.lstCategories.find(x => x.name === c)!.checked = true;
    });
    
  }

  private getCategories() {
    this.categoryService.getCategories().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.lstCategories = data.respuesta.map((x: string) => {
            return {name: x, checked: false}
          });
        }
      },
      error: error => {
        this.alert = new Alert(error.error, 'danger');
      }
    });
  }

  get getNameField() {
    return this.frmProduct.get('name');
  }

  get getPriceField() {
    return this.frmProduct.get('price');
  }

  get getQuantityField() {
    return this.frmProduct.get('quantity');
  }

  get getImagesField() {
    return this.frmProduct.get('images');
  }

  saveProduct() {
    if (this.frmProduct.valid) {
      if (this.lstCategories && this.lstCategories.filter(x => x.checked).length > 0) {
        this.modalService.openModal(
          !this.codeProduct ? 'Crear producto' : 'Actualizar producto',
          '¿Está seguro de almacenar el registro?'
        ).result.then((result) => {
          if (result) {
            if (this.codeProduct) {
              if (this.files && this.files.length > 0) {
                this.uploadImages();
              } else {
                this.updateProduct();
              }
            } else {
              this.uploadImages();
            }
          }
        });
      } else {
        this.alert = new Alert('Debe seleccionar por lo menos una categoria', 'danger');
      }
    } else {
      this.frmProduct.markAllAsTouched();
    }
  }

  private updateProduct() {
    const productDTO = this.mapProductDTO();
    this.productService.updateProduct(this.codeProduct, productDTO).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: response => {
        if (response && response.estado) {
          this.alert = new Alert('Producto actualizado exitosamente', 'success');
          this.clearForm();
        }
      },
      error: error => {

      }
    });
  }

  private createProduct() {
    const productDTO = this.mapProductDTO();
    this.productService.createProduct(productDTO).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: response => {
        if (response && response.estado) {
          this.alert = new Alert('Producto creado exitosamente', 'success');
          this.clearForm();
        }
      },
      error: error => {

      }
    });
  }

  cancel() {
    this.modalService.openModal('Cancelar', '¿Está seguro de cancelar la acción').result.then((result) => {
      if (result) {
        this.clearForm();
        this.route.navigate(['/pages/home']);
      }
    });
  }

  private uploadImages() {
    if (this.files && this.files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        formData.append('file', this.files[i]);
      }
      this.imageService.upload(formData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: response => {
          if (response && response.respuesta.length > 0) {
            this.lstImages = [];
            response.respuesta.forEach((element: any) => {
              const image: Image = {
                id: element.public_id,
                url: element.url
              };
              this.lstImages.push(image);
            });
            if (this.codeProduct) { 
              this.updateProduct() 
            }
            else { 
              this.createProduct();
            }
          }
        },
        error: error => {
          this.alert = new Alert(error.error.respuesta, 'danger');
        }
      });
    }
  }

  private clearForm() {
    this.frmProduct.reset();
    this.noCheck = false;
    this.lstCategories.forEach(x => x.checked = false);
    this.lstImages = [];
  }

  onFileChange(event: any) {
    const files = event.target.files;    
    if (files && files.length > 0) {
      this.files = files;
    }
  }

  private mapProductDTO(): ProductDTO {
    const product: ProductDTO = {
      nombre: this.getNameField?.value,
      descripcion: this.frmProduct.get('description')?.value,
      precio: this.getPriceField?.value,
      vendedor: this.emailUser,
      disponibilidad: this.getQuantityField?.value,
      categorias: this.lstCategories.filter(x => x.checked).map(x => x.name),
      imagenes: this.lstImages
    };

    return product;
  }
}
