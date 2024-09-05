import { AsyncPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { AucunResultatIcone } from '@app/shared/icones/aucun-resultat.icone';
import { ChargementIcone } from '@app/shared/icones/chargement.icone';
import { CroixIcone } from '@app/shared/icones/croix.icone';
import { ModificationIcone } from '@app/shared/icones/modification.icone';
import { Referentiel } from '@app/shared/types/app.types';
import { ReferentielsService } from '../referentiels.service';

@Component({
  selector: 'app-resultats-referentiels',
  standalone: true,
  imports: [
    AsyncPipe,
    ModificationIcone,
    CroixIcone,
    ChargementIcone,
    AucunResultatIcone
  ],
  templateUrl: './resultats-referentiels.component.html',
  styleUrl: './resultats-referentiels.component.scss'
})
export class ResultatsReferentielsComponent {

  readonly service = inject(ReferentielsService);

  referentielsFiltres$ = this.service.getReferentielsFiltres();
  estChargementDonneesEnCours$ = this.service.getEstChargementEnCours();

  modificationReferentiel = output<Referentiel>();
  suppressionReferentiel = output<Referentiel>();

  modifierReferentiel(referentiel: Referentiel): void {
    this.modificationReferentiel.emit(referentiel);
  }

  supprimerReferentiel(referentiel: Referentiel): void {
    this.suppressionReferentiel.emit(referentiel);
  }
}
