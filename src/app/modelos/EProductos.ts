import { EDetalleIngresoListado } from "./EIngreso";

export class EProductos {
  public ProductoId: string = "";
  public ProductoCodigo: string = "";
  public TipoProductoId: number = 0;
  public TipoProductoTexto: string | undefined= "" ;
  public ProductoNombre: string | undefined = "";
  public ProductoDescripcion: string | undefined = "";
  public ProductoEstado: string = "";
  public UsuarioRegistroId: number = 0
  public MarcaId: number = 0;
  public ColorId: number = 0;
}
export class EProductosListado {
  public ProductoId: string  = "";
  public TipoProductoId: number = 0;
  public TipoProductoTexto: string | undefined = "";
  public ProductoCodigo: string = "";
  public ProductoNombre: string | undefined = "";
  public ProductoDescripcion: string | undefined = "";
  public ProductoEstado: string = "";
  public ProductoEstadoTexto: string = "";
  public UsuarioRegistroId: number = 0
  public TipoChip: string = "";
  public ColorId: number = 0;
  public MarcaId: number = 0;
  public EquipoEstado: string = "";
  public ColorTexto: string = "";
  public MarcaTexto: string = "";
  public Desde: string = "";
  public Hasta: string = "";
  public lstDetalleIngreso: Array<EDetalleIngresoListado> = [];
}
