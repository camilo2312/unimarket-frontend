import { Estado } from "./Estado";
import { ProductGetDTO } from "./ProductGetDTO";

export interface UserGetDTO {
    cedula: string;
    nombreCompleto: string;
    email: string;
    numeroTelefono: string;
    contrasena: string;
    nombreUsuario: string;
    estado: Estado;
    lstFavoritos: Array<ProductGetDTO>;
}