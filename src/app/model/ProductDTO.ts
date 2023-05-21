import { Image } from './Image';

export interface ProductDTO {
    nombre: string;
    descripcion: string;
    precio: number;
    disponibilidad: number;
    vendedor: string;
    imagenes: Array<Image>;
    categorias: Array<string>;
}