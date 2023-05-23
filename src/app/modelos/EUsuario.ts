import { EConjuntoDato } from "./EConjuntoDato";
import { EPerfilListado, EUsuarioPerfil } from "./EPerfil";
import { EPersonaEmpresa } from "./EPersonaEmpresa";

export class EUsuario{
  public UsuarioId: number = 0;
  public PersonaEmpresaId: number = 0;
  public UsuarioLogin: string = ""
  public UsuarioClave: string = ""
  public UsuarioEstado: string = ""
  public UsuarioRegistroId: number = 0;
}

export class EUsuarioListado extends EPersonaEmpresa {
  public UsuarioId: number = 0;
  public UsuarioLogin: string = ""
  public UsuarioClave: string = ""
  public UsuarioEstado: string = ""
  public UsuarioRegistroId: number = 0;
  public UsuarioEstadoTexto: string = ""
  public GrupoDescripcion: string = ""
  public GrupoId: number = 0;
  public PerfilId: number = 0;
  public nombreUsuarioCompleto: string = "";
  public lstPerfilUsuario: Array<EPerfilListado> = [];
}
