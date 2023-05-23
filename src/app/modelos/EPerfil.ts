export class EPerfil {
  public PerfilId: number = 0;
  public PerfilDescripcion: string = "";
  public PerfilEstado: string = ""
}
export class EPerfilListado {
  public PerfilId: number = 0;
  public PerfilDescripcion: string = "";
  public PerfilEstado: string = "";
  public PerfilEstadoTexto: string = "";
  public UsuarioPerfilDefecto: boolean = false;

}

export class EUsuarioPerfil {
  public UsuarioPerfilId: number = 0;
  public UsuarioId: number = 0;
  public PerfilId: number = 0;
  public UsuarioPerfilDefecto: boolean = false;
  public UsuarioPerfilEstado: string = "";
}
