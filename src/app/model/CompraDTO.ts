import { DetalleCompraDTO } from "./DetalleCompraDTO";
import { MedioPago } from "./MedioPago";

export interface CompraDTO {
    medioPago: MedioPago;
    codigoUsuario: string;
    total: number;
    detalleComprasDTO: Array<DetalleCompraDTO>;
}