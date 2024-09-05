import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppConstantes } from '@app/shared/constantes/app.constantes';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { InfosVente, Objet, Referentiel } from '@shared/types/app.types';
import { ModaleMiseEnVenteObjetService } from '@stock/modale-mise-en-vente-objet/modale-mise-en-vente-objet.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-mise-en-vente-objet',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './modale-mise-en-vente-objet.component.html',
  styleUrl: './modale-mise-en-vente-objet.component.scss'
})
export class ModaleMiseEnVenteObjetComponent {

  readonly service = inject(ModaleMiseEnVenteObjetService);
  readonly referentielsService = inject(ReferentielsService);

  readonly CHAMP_INFOS_OBJET = 'infosObjet';
  readonly CHAMP_DATE_MISE_EN_VENTE = 'dateMiseEnVente';
  readonly CHAMP_PLATEFORME_VENTE = 'plateformeVente';
  readonly CHAMP_URL_VENTE = 'urlVente';
  readonly CHAMP_DELAI_VENTE = 'delaiVente';

  plateformesVente$ = this.referentielsService.getPlateformesVente();

  formulaire = new FormGroup({
    [this.CHAMP_INFOS_OBJET]: new FormControl<string | null>({value: null, disabled: true}),
    [this.CHAMP_DATE_MISE_EN_VENTE]: new FormControl<Date | null>(new Date(), Validators.required),
    [this.CHAMP_PLATEFORME_VENTE]: new FormControl<Referentiel | null>(null, Validators.required),
    [this.CHAMP_URL_VENTE]: new FormControl<string | null>(null, [Validators.required, Validators.pattern(AppConstantes.REGEX_URL)]),
    [this.CHAMP_DELAI_VENTE]: new FormControl<number | null>(null, Validators.required),
  });

  $modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  $objetAMettreEnVente = input<Objet | null>();
  fermeture = output<void>();

  get controleInfosObjet() {
    return this.formulaire.controls[this.CHAMP_INFOS_OBJET];
  }

  get controleDateMiseEnVente() {
    return this.formulaire.controls[this.CHAMP_DATE_MISE_EN_VENTE];
  }

  get controlePlateformeVente() {
    return this.formulaire.controls[this.CHAMP_PLATEFORME_VENTE];
  }

  get controleUrlVente() {
    return this.formulaire.controls[this.CHAMP_URL_VENTE];
  }
  
  get controleDelaiVente() {
    return this.formulaire.controls[this.CHAMP_DELAI_VENTE];
  }

  constructor() {
    effect(() => {
      const modale = this.$modale();
      const objetAMettreEnVente = this.$objetAMettreEnVente();

      if(objetAMettreEnVente) {
        this.controleInfosObjet.setValue(objetAMettreEnVente.description + ' - ' + objetAMettreEnVente.infos);

        if(modale) {
          modale.nativeElement.showModal();
        }
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const objetAMettreEnVente = this.$objetAMettreEnVente();

    if(!objetAMettreEnVente) {
      throw new Error("L'objet à mettre en vente doit être défini");
    }

    const valeurFormulaire = this.formulaire.getRawValue();

    const infosVente: InfosVente = {
      plateformeVente: valeurFormulaire.plateformeVente || null,
      urlVente: valeurFormulaire.urlVente || null,
      dateMiseEnVente: valeurFormulaire.dateMiseEnVente || null,
      delaiVente: valeurFormulaire.delaiVente || null,
    };

    this.service.mettreEnVente(objetAMettreEnVente, infosVente)
    .pipe(
      tap(() => {
        this.#fermerModale();
      })
    )
    .subscribe();
  }

  #fermerModale() {
    this.formulaire.reset();
    this.$modale()?.nativeElement?.close();
    this.fermeture.emit();
  }
}
