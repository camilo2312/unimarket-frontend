import { DireccionGetDTO } from './DireccionGetDTO';
import { DetalleCompraGetDTO } from './DetalleCompraGetDTO';
import { MedioPago } from './MedioPago';
import { EstadoCompra } from './EstadoCompra';

export interface CompraGetDTO {
    codigoCompra: number;
    fechaCreacion: Date;
    medioPago: MedioPago;
    codigoUsuario: string;
    precioTotal: number;
    estadoCompra: EstadoCompra;
    detalleCompraGetDTO: Array<DetalleCompraGetDTO>;
    direccion: DireccionGetDTO;
}