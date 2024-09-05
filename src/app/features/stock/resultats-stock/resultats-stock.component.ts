import { AsyncPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ReferentielsService } from '@app/features/referentiels/referentiels.service';
import { AucunResultatIcone } from "@shared/icones/aucun-resultat.icone";
import { CadeauIcone } from "@shared/icones/cadeau.icone";
import { ChargementIcone } from "@shared/icones/chargement.icone";
import { CroixIcone } from "@shared/icones/croix.icone";
import { ModificationIcone } from "@shared/icones/modification.icone";
import { VenteIcone } from "@shared/icones/vente.icone";
import { Objet } from '@shared/types/app.types';
import { StockService } from '@stock/stock.service';

@Component({
  selector: 'app-resultats-stock',
  standalone: true,
  imports: [
    AsyncPipe,
    ModificationIcone,
    VenteIcone,
    CadeauIcone,
    CroixIcone,
    ChargementIcone,
    AucunResultatIcone
],
  templateUrl: './resultats-stock.component.html',
  styleUrl: './resultats-stock.component.scss'
})
export class ResultatsStockComponent {

  readonly #service = inject(StockService);
  readonly #referentielsService = inject(ReferentielsService);

  readonly statutObjetVendu$ = this.#referentielsService.getStatutObjetVendu();
  readonly statutObjetDonne$ = this.#referentielsService.getStatutObjetDonne();
  
  objetsFiltres$ = this.#service.getObjetFiltres();
  estChargementDonneesEnCours$ = this.#service.getEstChargementEnCours();

  modificationObjet = output<Objet>();
  miseEnVenteObjet = output<Objet>();
  donObjet = output<Objet>();
  suppressionObjet = output<Objet>();

  modifierObjet(objet: Objet): void {
    this.modificationObjet.emit(objet);
  }

  mettreEnVenteObjet(objet: Objet): void {
    this.miseEnVenteObjet.emit(objet);
  }

  donnerObjet(objet: Objet): void {
    this.donObjet.emit(objet);
  }

  supprimerObjet(objet: Objet): void {
    this.suppressionObjet.emit(objet);
  }
}
