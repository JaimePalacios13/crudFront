import { clientes } from "./clientes";
import { formaPago } from "./formaPago";

export class Solicitudes {
    id: number = 0;
    monto!: string;
    formasDePago: formaPago = new formaPago();
    plazo!: string;
    fecha_creacion!: string;
    persona: clientes = new clientes();
  }
  