import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@app/app.routes';
import { VentesService } from '@app/features/ventes/ventes.service';
import { InfosVente, Objet } from '@shared/types/app.types';
import { StockService } from '@stock/stock.service';
import { mergeMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModaleMiseEnVenteObjetService {

  readonly #stockService = inject(StockService);
  readonly #ventesService = inject(VentesService);
  readonly #router = inject(Router);
  
  mettreEnVente(objet: Objet, infosVente: InfosVente) {
    return this.#stockService.mettreObjetEnVente(objet)
    .pipe(
      mergeMap(() => {
        return this.#ventesService.ajouterVente(objet.id!, infosVente);
      }),
      // Navigation vers page des ventes
      tap(() => {
        this.#router.navigate([ROUTES.VENTES]);
      })
    );
  }

}
