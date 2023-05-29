export interface DetalleCompraGetDTO {
    codigo: number;
    unidades: number;
    precioProducto: number;
    codigoCompra: number;
    codigoProducto: number;
    nombreProducto?: string;
}