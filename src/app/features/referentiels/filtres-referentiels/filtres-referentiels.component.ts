import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FiltresReferentiel } from '@app/shared/types/app.types';

@Component({
  selector: 'app-filtres-referentiels',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './filtres-referentiels.component.html',
  styleUrl: './filtres-referentiels.component.scss'
})
export class FiltresReferentielsComponent {

  readonly CHAMP_TYPE = 'type';
  readonly CHAMP_CODE = 'code';
  readonly CHAMP_LIBELLE = 'libelle';
  readonly CHAMP_EST_MODIFIABLE = 'estModifiable';

  get controleType() {
    return this.formulaireFiltres.controls[this.CHAMP_TYPE];
  }

  get controleCode() {
    return this.formulaireFiltres.controls[this.CHAMP_CODE];
  }

  get controleLibelle() {
    return this.formulaireFiltres.controls[this.CHAMP_LIBELLE];
  }

  get controleEstModifiable() {
    return this.formulaireFiltres.controls[this.CHAMP_EST_MODIFIABLE];
  }

  formulaireFiltres = new FormGroup({
    [this.CHAMP_TYPE]: new FormControl<string | undefined>(undefined),
    [this.CHAMP_CODE]: new FormControl<string | undefined>(undefined),
    [this.CHAMP_LIBELLE]: new FormControl<string | undefined>(undefined),
    [this.CHAMP_EST_MODIFIABLE]: new FormControl<boolean | undefined>(true),
  });

  $alignement = input<'vertical' | 'horizontal'>();

  filtrage = output<FiltresReferentiel>();

  constructor() {
    this.filtrer();
  }

  filtrer(): void {
    const filtres = this.formulaireFiltres.value;
    
    this.filtrage.emit({
      type: filtres.type || undefined,
      code: filtres.code || undefined,
      libelle: filtres.libelle || undefined,
      estModifiable: filtres.estModifiable || undefined,
    });
  }
}
