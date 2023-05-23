export class EConjuntoDato {

  public ConjuntoDatoId: number;
  public ConjuntoDatoGrupo: string;
  public ConjuntoDatoValor: string;
  public ConjuntoDatoTexto: string;
  public ConjuntoDatoEstado: string;

  constructor(ConjuntoDatoId: number, ConjuntoDatoGrupo: string, ConjuntoDatoValor: string, ConjuntoDatoTexto: string, ConjuntoDatoEstado: string) {
    this.ConjuntoDatoId = ConjuntoDatoId;
    this.ConjuntoDatoGrupo = ConjuntoDatoGrupo;
    this.ConjuntoDatoValor = ConjuntoDatoValor;
    this.ConjuntoDatoTexto = ConjuntoDatoTexto;
    this.ConjuntoDatoEstado = ConjuntoDatoEstado;


  }
}
