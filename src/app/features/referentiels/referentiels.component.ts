import { AsyncPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { EventService } from '@app/core/event/event.service';
import { ModaleAjoutReferentielComponent } from "@app/features/referentiels/modale-ajout-referentiel/modale-ajout-referentiel.component";
import { ModaleModificationReferentielComponent } from "@app/features/referentiels/modale-modification-referentiel/modale-modification-referentiel.component";
import { ModaleSuppressionReferentielComponent } from "@app/features/referentiels/modale-suppression-referentiel/modale-suppression-referentiel.component";
import { ReferentielsService } from '@referentiels/referentiels.service';
import { FiltresReferentiel, Referentiel } from '@shared/types/app.types';
import { FiltresReferentielsComponent } from "./filtres-referentiels/filtres-referentiels.component";
import { ResultatsReferentielsComponent } from "./resultats-referentiels/resultats-referentiels.component";

// Fonctionnalités :
// - voir la liste des valeurs des référentiels (OK)
// - ajouter une valeur à un référentiel (OK)
// - modifier une valeur d'un référentiel (OK)
// - supprimer une valeur d'un référentiel (OK)

@Component({
  selector: 'app-referentiels',
  standalone: true,
  imports: [
    AsyncPipe,
    ModaleAjoutReferentielComponent,
    ModaleModificationReferentielComponent,
    ModaleSuppressionReferentielComponent,
    FiltresReferentielsComponent,
    ResultatsReferentielsComponent
],
  templateUrl: './referentiels.component.html',
  styleUrl: './referentiels.component.scss'
})
export class ReferentielsComponent {

  readonly #service = inject(ReferentielsService);
  readonly #eventService = inject(EventService);

  referentielAModifier: Referentiel | null = null;
  estModaleAjoutOuverte: boolean = false;
  referentielASupprimer: Referentiel | null = null;

  alignement: 'vertical' | 'horizontal' = window.innerWidth > 1000 ? 'vertical' : 'horizontal';

  constructor() {
    effect(() => {
      if(this.#eventService.getResizeEvent()) {
        this.alignement = window.innerWidth > 1000 ? 'vertical' : 'horizontal';
      }
    });
  }

  filtrer(filtresReferentiel: FiltresReferentiel): void {
    this.#service.filtrerReferentiels(filtresReferentiel);
  }

  ajouterReferentiel(referentielAAjouter: Referentiel): void {
    this.referentielAModifier = referentielAAjouter;
    this.estModaleAjoutOuverte = true;
  }

  modifierReferentiel(referentielAModifier: Referentiel): void {
    this.referentielAModifier = referentielAModifier;
  }

  supprimerReferentiel(referentielASupprimer: Referentiel): void {
    this.referentielASupprimer = referentielASupprimer;
  }
}
