import { _isNumberValue } from '@angular/cdk/coercion';
import { FormControl, FormGroup } from '@angular/forms';

export class ValidarPermisos{

  static verEliminados(PerfilId:number) {
    if (PerfilId == 1) {
      return true;
    } else {
      return false;
    }
  }  
}

