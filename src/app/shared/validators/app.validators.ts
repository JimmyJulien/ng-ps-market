import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from "@angular/forms";
import { ReferentielsService } from "@referentiels/referentiels.service";
import { Referentiel } from "@shared/types/app.types";
import { map, Observable, of } from "rxjs";

export class AppValidators {

  private constructor() {}

  static champVide(control: FormControl<string | null>): ValidationErrors | null {
    if(!control.value) return null;
    return control.value.trim() === '' ? {champVide: true} : null;
  }

  static codeValeurExiste(referentiel: Referentiel | null, service: ReferentielsService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if(!referentiel) {
        return of(null);
      }

      return service.verifierExistenceReferentiel(control.value)
      .pipe(
        map(estValeurExistante => {
          return estValeurExistante ? {codeValeurExiste: true} : null;
        })
      )
    };
  }
}