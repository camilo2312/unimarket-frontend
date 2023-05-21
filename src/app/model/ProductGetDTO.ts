import { Image } from "./Image";

export interface ProductGetDTO {
    codigo: number;
    nombre: string;
    descripcion: string;
    precio: number;
    disponibilidad: number;
    fechaLimite: Date;
    fechaPublicacion: Date;
    vendedor: string;
    imagenes: Array<Image>;
    categorias: Array<string>;
    seleccion?: boolean;
}