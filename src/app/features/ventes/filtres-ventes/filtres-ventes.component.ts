import { AsyncPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { FiltresVente, Referentiel } from '@shared/types/app.types';
import { tap } from 'rxjs';
import { SelectionMultipleComponent } from "../../../shared/components/selection-multiple/selection-multiple.component";

@Component({
  selector: 'app-filtres-ventes',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, SelectionMultipleComponent],
  templateUrl: './filtres-ventes.component.html',
  styleUrl: './filtres-ventes.component.scss'
})
export class FiltresVentesComponent {

  readonly #referentielsService = inject(ReferentielsService);

  readonly CHAMP_INFOS_OBJET = 'infosObjet';
  readonly CHAMP_PLATEFORMES_VENTE = 'plateformesVente';
  readonly CHAMP_URL_VENTE = 'urlVente';
  readonly CHAMP_DATE_MISE_EN_VENTE = 'dateMiseEnVente';
  readonly CHAMP_DATE_LIMITE_VENTE = 'dateLimiteVente';
  readonly CHAMP_STATUTS = 'statuts';

  plateformes$ = this.#referentielsService.getPlateformesVente();
  statutsVente$ = this.#referentielsService.getStatutsVente();

  formulaireFiltres = new FormGroup({
    [this.CHAMP_INFOS_OBJET]: new FormControl<string | null>(null),
    [this.CHAMP_PLATEFORMES_VENTE]: new FormControl<Referentiel[]>([]),
    [this.CHAMP_URL_VENTE]: new FormControl<string | null>(null),
    [this.CHAMP_DATE_MISE_EN_VENTE]: new FormControl<Date | null>(null),
    [this.CHAMP_DATE_LIMITE_VENTE]: new FormControl<Date | null>(null),
    [this.CHAMP_STATUTS]: new FormControl<Referentiel[]>([]),
  });

  filtrage = output<FiltresVente>();

  get controleInfosObjet() {
    return this.formulaireFiltres.controls[this.CHAMP_INFOS_OBJET];
  }

  get controlePlateformesVente() {
    return this.formulaireFiltres.controls[this.CHAMP_PLATEFORMES_VENTE];
  }

  get controleUrlVente() {
    return this.formulaireFiltres.controls[this.CHAMP_URL_VENTE];
  }

  get controleDateMiseEnVente() {
    return this.formulaireFiltres.controls[this.CHAMP_DATE_MISE_EN_VENTE];
  }

  get controleDateLimiteVente() {
    return this.formulaireFiltres.controls[this.CHAMP_DATE_LIMITE_VENTE];
  }

  get controleStatuts() {
    return this.formulaireFiltres.controls[this.CHAMP_STATUTS];
  }

  constructor() {
    this.#referentielsService.getStatutVenteEnCours()
    .pipe(
      tap(statutVenteEnCours => {
        this.controleStatuts.setValue([statutVenteEnCours]);
        this.filtrer();
      })
    )
    .subscribe();
  }

    filtrer(): void {
    const filtres = this.formulaireFiltres.value;

    this.filtrage.emit({
      infosObjet: filtres.infosObjet || undefined,
      plateformesVente: filtres.plateformesVente || undefined,
      urlVente: filtres.urlVente || undefined,
      dateMiseEnVente: filtres.dateMiseEnVente || undefined,
      dateLimiteDeVente: filtres.dateLimiteVente || undefined,
      statuts: filtres.statuts || undefined,
    });
  }
}
