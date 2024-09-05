import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { Referentiel } from '@shared/types/app.types';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-modification-referentiel',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modale-modification-referentiel.component.html',
  styleUrl: './modale-modification-referentiel.component.scss'
})
export class ModaleModificationReferentielComponent {
  
  readonly referentielsService = inject(ReferentielsService);

  readonly CHAMP_TYPE = 'type';
  readonly CHAMP_CODE = 'code';
  readonly CHAMP_LIBELLE = 'libelle';
  readonly CHAMP_EST_MODIFIABLE = 'estModifiable';

  $modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  formulaire = new FormGroup({
    [this.CHAMP_TYPE]: new FormControl<string | null>({value: null, disabled: true}, Validators.required),
    [this.CHAMP_CODE]: new FormControl<string | null>({value: null, disabled: true}, Validators.required),
    [this.CHAMP_LIBELLE]: new FormControl<string |null>(null, Validators.required),
    [this.CHAMP_EST_MODIFIABLE]: new FormControl<boolean>(false, Validators.required),
  });

  $referentielAModifier = input<Referentiel | null>(null);
  fermeture = output<void>();

  get controleCode() {
    return this.formulaire.controls[this.CHAMP_CODE];
  }

  get controleType() {
    return this.formulaire.controls[this.CHAMP_TYPE];
  }

  get controleLibelle() {
    return this.formulaire.controls[this.CHAMP_LIBELLE];
  }

  get controleEstModifiable() {
    return this.formulaire.controls[this.CHAMP_EST_MODIFIABLE];
  }

  constructor() {
    effect(() => {
      const referentielAModifier = this.$referentielAModifier();

      if(referentielAModifier) {
        this.controleType.setValue(referentielAModifier.type);
        this.controleCode.setValue(referentielAModifier.code);
        this.controleLibelle.setValue(referentielAModifier.libelle);
        this.controleEstModifiable.setValue(referentielAModifier.estModifiable);

        this.$modale()?.nativeElement?.showModal();
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const valeurFormulaire = this.formulaire.getRawValue();

    const referentielModifie: Referentiel = {
      ...this.$referentielAModifier()!,
      code: valeurFormulaire.code!,
      libelle: valeurFormulaire.libelle!,
    };

    this.referentielsService.modifierReferentiel(referentielModifie)
    .pipe(
      tap(() => {
        this.#fermerModale();
      })
    )
    .subscribe();
  }

  #fermerModale(): void {
    this.formulaire.reset();
    this.$modale()?.nativeElement?.close();
    this.fermeture.emit();
  }
}
