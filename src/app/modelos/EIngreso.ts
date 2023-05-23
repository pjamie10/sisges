
export class EIngreso {
  public IngresoId: number = 0;
  public TipoComprobanteId: number = 0;
  public IngresoSerieComprobante: string = "";
  public IngresoNroComprobante: string = "";
  public PersonaRecojoId: number = 0;
  public IngresoFecha: Date | undefined;
  public UsuarioRegistroId: number = 0;
  public IngresoRegistroFecha: Date | undefined;
  public IngresoEliminado!: Boolean;
  public lstDetalleIngreso: Array<EDetalleIngreso> = [];
}

export class EIngresoListado {
  public IngresoId: number = 0;
  public TipoComprobanteId: number = 0;
  public IngresoSerieComprobante: string = "";
  public IngresoNroComprobante: string = "";
  public PersonaRecojoId: number = 0;
  public IngresoFecha: Date | undefined;
  public UsuarioRegistroId: number = 0;
  public IngresoRegistroFecha: Date | undefined;
  public TipoComprobanteTexto: string = "";
  public PersonaRecojo: String = "";
  public IngresoEliminado!: Boolean;
  public lstDetalleIngresoListado: Array<EDetalleIngresoListado> = [];
}

export class EDetalleIngreso {
  public DetalleIngresoId: number = 0;
  public IngresoId: number = 0;
  public ProductoId: string = "";
  public ProductoCodigo: string = "";
  public EquipoEstado: string = "";
  public EquipoEstadoRegistro: string = "";  
  public ProductoNombre: string = "";
  public TipoProductoDescripcion: string = "";
}

export class EDetalleIngresoListado {
  public DetalleIngresoId: number = 0;
  public IngresoId: number = 0;
  public ProductoId: string = "";
  public ProductoCodigo: string = "";
  public EquipoEstado: string = "";
  public EquipoEstadoRegistro: string = "";
  public ProductoNombre: string = "";
  public TipoProductoDescripcion: string = "";
  public TipoProductoId: number = 0;
  public TipoProductoTexto: string | undefined = "";
  public ProductoEstado: string = "";
  public MarcaId: number = 0;
  public MarcaDescripcion: string = "";
  public ProductoEstadoTexto: string = "";
  public UsuarioRegistroId: number = 0
  public TipoChip: string = "";
  public Desde: string = "";
  public Hasta: string = "";
}
