import { inject, Injectable } from '@angular/core';
import { ReferentielsService } from '@app/features/referentiels/referentiels.service';
import { Objet, Vente } from '@shared/types/app.types';
import { StockService } from '@stock/stock.service';
import { VentesService } from '@ventes/ventes.service';
import { mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModaleFinalisationVenteService {

  readonly #ventesService = inject(VentesService);
  readonly #stockService = inject(StockService);
  readonly #referentielsService = inject(ReferentielsService);

  finaliserVente(venteAFinaliser: Vente) {
    // Mise à jour statut vente + annulation autres ventes sur même objet
    return this.#ventesService.finaliserVente(venteAFinaliser)
    .pipe(
      // Mise à jour statut objet à vendre
      mergeMap(() => {
        return this.#referentielsService.getStatutObjetVendu();
      }),
      mergeMap(statutObjetVendu => {
        const objet: Objet = {
          ...venteAFinaliser.objet,
          statutObjet: statutObjetVendu,
        };
        return this.#stockService.modifierObjet(objet);
      })
    );
  }
}
