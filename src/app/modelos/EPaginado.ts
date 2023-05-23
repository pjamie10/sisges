export class EPaginadoSolicitud {
  public PaginaNumero: number = 0;
  public PaginaTamanio: number = 0;
  public OrdenarPor: string = ""
}

export class EPaginadoRespuesta {
  public TotalFilas: number = 0;
  public TotalPaginas: number = 0;
  public Data!: Array<any>;
}

