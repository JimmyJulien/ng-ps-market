import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { InfosReferentiel, Referentiel } from '@shared/types/app.types';
import { AppValidators } from '@shared/validators/app.validators';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-ajout-referentiel',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modale-ajout-referentiel.component.html',
  styleUrl: './modale-ajout-referentiel.component.scss'
})
export class ModaleAjoutReferentielComponent {
  
  readonly referentielsService = inject(ReferentielsService);

  readonly CHAMP_TYPE = 'type';
  readonly CHAMP_CODE = 'code';
  readonly CHAMP_LIBELLE = 'libelle';
  readonly CHAMP_EST_MODIFIABLE = 'estModifiable';

  $modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  formulaire = new FormGroup({
    [this.CHAMP_TYPE]: new FormControl<string | null>(null, Validators.required),
    [this.CHAMP_CODE]: new FormControl<string | null>(null, Validators.required),
    [this.CHAMP_LIBELLE]: new FormControl<string |null>(null, Validators.required),
    [this.CHAMP_EST_MODIFIABLE]: new FormControl<boolean>(false, Validators.required),
  });

  $referentielAModifier = input<Referentiel | null>(null);
  $estModaleAjoutOuverte = input<boolean>(false);
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
      const estModaleAjoutOuverte = this.$estModaleAjoutOuverte();

      if(referentielAModifier && estModaleAjoutOuverte) {
        this.controleCode.setAsyncValidators(AppValidators.codeValeurExiste(referentielAModifier, this.referentielsService));
        this.$modale()?.nativeElement?.showModal();
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const valeurFormulaire = this.formulaire.value;

    const infosReferentiel: InfosReferentiel = {
      type: valeurFormulaire.type!,
      code: valeurFormulaire.code!,
      libelle: valeurFormulaire.libelle!,
      estModifiable: valeurFormulaire.estModifiable!,
    };

    this.referentielsService.ajouterReferentiel(infosReferentiel)
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
