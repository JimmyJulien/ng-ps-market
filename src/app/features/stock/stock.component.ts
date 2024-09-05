import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EventService } from '@app/core/event/event.service';
import { SelectionMultipleComponent } from '@app/shared/components/selection-multiple/selection-multiple.component';
import { FiltresObjet, Objet } from '@shared/types/app.types';
import { FiltresStockComponent } from "@stock/filtres-stock/filtres-stock.component";
import { ModaleAjoutObjetComponent } from "@stock/modale-ajout-objet/modale-ajout-objet.component";
import { ModaleDonObjetComponent } from "@stock/modale-don-objet/modale-don-objet.component";
import { ModaleMiseEnVenteObjetComponent } from "@stock/modale-mise-en-vente-objet/modale-mise-en-vente-objet.component";
import { ModaleModificationObjetComponent } from "@stock/modale-modification-objet/modale-modification-objet.component";
import { ModaleSuppressionObjetComponent } from "@stock/modale-suppression-objet/modale-suppression-objet.component";
import { ResultatsStockComponent } from "@stock/resultats-stock/resultats-stock.component";
import { StockService } from '@stock/stock.service';

// Fonctionnalités :
// - voir liste objets (OK)
// - filtrer les objets (OK)
// - ajouter un objet (OK)
// - modifier un objet (OK)
// - mettre en vente un objet (OK)
// - donner un objet(OK)

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    FiltresStockComponent,
    ResultatsStockComponent,
    ModaleAjoutObjetComponent,
    ModaleModificationObjetComponent,
    ModaleMiseEnVenteObjetComponent,
    ModaleDonObjetComponent,
    ModaleSuppressionObjetComponent,
    SelectionMultipleComponent,
    ReactiveFormsModule
],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent {

  readonly #service = inject(StockService);
  readonly #eventService = inject(EventService);
  
  ouvrirModaleAjout = false;
  objetAModifier: Objet | null = null;
  objetAMettreEnVente: Objet | null = null;
  objetADonner: Objet | null = null;
  objetASupprimer: Objet | null = null;

  alignement: 'vertical' | 'horizontal' = window.innerWidth > 1000 ? 'vertical' : 'horizontal';

  constructor() {
    effect(() => {
      if(this.#eventService.getResizeEvent()) {
        this.alignement = window.innerWidth > 1000 ? 'vertical' : 'horizontal';
      }
    });
  }

  filtrer(filtresObjet: FiltresObjet): void {
    this.#service.filtrerObjets(filtresObjet);
  }

  modifierObjet(objet: Objet): void {
    this.objetAModifier = objet;
  }

  mettreEnVenteObjet(objet: Objet): void {
    this.objetAMettreEnVente = objet;
  }

  donnerObjet(objet: Objet): void {
    this.objetADonner = objet;
  }

  supprimerObjet(objet: Objet): void {
    this.objetASupprimer = objet;
  }
}
