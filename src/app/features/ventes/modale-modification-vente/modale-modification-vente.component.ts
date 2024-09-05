import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppConstantes } from '@app/shared/constantes/app.constantes';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { InfosVente, Referentiel, Vente } from '@shared/types/app.types';
import { ModaleModificationVenteService } from '@ventes/modale-modification-vente/modale-modification-vente.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-modification-vente',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './modale-modification-vente.component.html',
  styleUrl: './modale-modification-vente.component.scss'
})
export class ModaleModificationVenteComponent {

  readonly service = inject(ModaleModificationVenteService);
  readonly referentielsService = inject(ReferentielsService);

  readonly CHAMP_PLATEFORME_VENTE = 'plateformeVente';
  readonly CHAMP_URL_VENTE = 'urlVente';
  readonly CHAMP_DATE_MISE_EN_VENTE = 'dateMiseEnVente';
  readonly CHAMP_DELAI_VENTE = 'delaiVente';

  plateformesVente$ = this.referentielsService.getPlateformesVente();

  $modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  formulaire = new FormGroup({
    [this.CHAMP_PLATEFORME_VENTE]: new FormControl<Referentiel | null>(null, Validators.required),
    [this.CHAMP_URL_VENTE]: new FormControl<string | null>(null, [Validators.required, Validators.pattern(AppConstantes.REGEX_URL)]),
    [this.CHAMP_DATE_MISE_EN_VENTE]: new FormControl<Date | null>(null, Validators.required),
    [this.CHAMP_DELAI_VENTE]: new FormControl<number | null>(null, Validators.required),
  });

  $venteAModifier = input<Vente | null>(null);
  fermeture = output<void>();

  get controlePlateformeVente() {
    return this.formulaire.controls[this.CHAMP_PLATEFORME_VENTE];
  }

  get controleUrlVente() {
    return this.formulaire.controls[this.CHAMP_URL_VENTE];
  }

  get controledateMiseEnVente() {
    return this.formulaire.controls[this.CHAMP_DATE_MISE_EN_VENTE];
  }

  get controleDelaiVente() {
    return this.formulaire.controls[this.CHAMP_DELAI_VENTE];
  }

  constructor() {
    effect(() => {
      const venteAModifier = this.$venteAModifier();

      if(venteAModifier) {
        this.controlePlateformeVente.setValue(venteAModifier.plateforme || null);
        this.controleUrlVente.setValue(venteAModifier.url || null);
        this.controledateMiseEnVente.setValue(venteAModifier.dateMiseEnVente || null);
        this.controleDelaiVente.setValue(venteAModifier.delai || null);

        this.$modale()?.nativeElement?.showModal();
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const valeurFormulaire = this.formulaire.value;
    const venteAModifier = this.$venteAModifier();

    if(!venteAModifier) return;

    const infosVente: InfosVente = {
      plateformeVente: valeurFormulaire.plateformeVente!,
      urlVente: valeurFormulaire.urlVente!,
      dateMiseEnVente: valeurFormulaire.dateMiseEnVente!,
      delaiVente: valeurFormulaire.delaiVente!,
    };

    this.service.modifierVente(venteAModifier, infosVente)
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
