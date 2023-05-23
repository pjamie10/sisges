import { ECategoria } from "./ECategoria";
import { EComprobante } from "./EComprobante";
import { EConjuntoDato } from "./EConjuntoDato";
import { EModalidad } from "./EModalidad";
import { EPersonaEmpresa } from "./EPersonaEmpresa";
import { EUsuarioListado } from "./EUsuario";

export class EVenta {
  public VentaId: number = 0;
  public ModalidadId: number = 0;
  public CategoriaId: number = 0;
  public TipoCategoriaId: string = "";
  public UsuarioRegistroId: number = 0;
  public ClienteId: number = 0;
  public AsesorId: number = 0;
  public TipoComprobanteId: string = ""
  public SerieComprobante: string = ""
  public NumeroComprobante: string = ""
  public VentaFecha: Date | undefined;
  public VentaInicialTotal: number = 0;
  public VentaRentaTotal: number = 0;
  public VentaSubTotal: number = 0;
  public VentaIGV: number = 0;
  public VentaMontoFinal: number = 0;
  public VentaFechaRegistro: Date | undefined;
  public VentaEstado: string = "";
  public VentaSEC: string = "";
  public objComprobanteVenta!: EComprobanteVenta;
  public objPersonaEmpresa!: EPersonaEmpresa;
  public lstDetalleVenta: Array<EDetalleVenta> = [];
}

export class EDetalleVenta {
  public DetalleVentaId: number = 0;
  public VentaId: number = 0;
  public ICIDId!: number | null;
  public ICID: string = "";
  public IMEIId!: number | null;
  public IMEI: string = "";
  public ProductoNombre: string = "";
  public VentaNumeroCelular: string = "";
  public OperadorOrigenId!: number | null;
  public ModalidadOrigenId!: number | null;
  public OperadorOrigenTexto: string = "";
  public ModalidadOrigenTexto: string = "";
  public DetalleVentaNroDias: number = 0;
  public PlanId!: number | null;
  public Plan: string = "";
  public DetalleVentaRenta: number = 0;
  public TipoVentaId: string = "";
  public TipoVenta: string = "";
  public DetalleVentaNroCuotas: number = 0;
  public DetalleVentaInicial: number = 0;
  public DetalleVentaMontoCuota: number = 0;
  public DetalleVentaSubTotal: number = 0;
  public DetalleVentaIGV: number = 0;
  public DetalleVentaMontoTotal: number = 0;
  public DetalleVentaEstado: string = "";
}

export class EVentaListas {
  public lstTipoComprobante: Array<EConjuntoDato> = []; //LISTA PARA DOCUMENTO DE VENTA
  public lstComprobante: Array<EComprobante> = [];//LISTA PARA DATOS DEL DOC. DE VENTA
  public lstUsuarios: Array<EUsuarioListado> = [];//LISTA DE ASESORES
  public lstCategoria: Array<ECategoria> = [];//LISTA DE CATEGORIA
  public lstModalidad: Array<EModalidad> = [];//LISTA DE MODALIDAD
  public lstTipoDocumentoIdentidad: Array<EConjuntoDato> = []; //LISTA PARA DOCUMENTO DE IDENTIDAD

}

export class EVentaListado {
  public VentaId: number = 0;
  public ModalidadNombre: string = "";
  public CategoriaNombre: string = "";
  public VentaFecha: string = "";
  public VentaSEC: string = "";
  public TipoComprobante: string = "";
  public ComprobanteSerie: string = "";
  public ComprobanteNumero: string = "";
  public TipoDocumento: string = "";
  public PersonaEmpresaNumeroDocumento: string = "";
  public ClienteRazonSocial: string = "";
  public Asesor: string = "";
}

export class EComprobanteVenta {
  public ComprobanteVentaId: number = 0;
  public VentaId: number = 0;
  public TipoComprobanteId: string = "";
  public ComprobanteSerie: string = "";
  public ComprobanteNumero: string = "";
  public ComprobanteFecha!: Date;
  public ComprobanteFechaRegistro!: Date;
  public ComprobanteVentaReferenciaId!: number;
  public EstadoId: string = "";
  public ComprobanteHash: string = "";
  public ComprobanteId!: number|null;
}
