import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DonsService } from '@app/features/dons/dons.service';
import { VentesService } from '@app/features/ventes/ventes.service';
import { InfosDon, Objet } from '@shared/types/app.types';
import { StockService } from '@stock/stock.service';
import { mergeMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModaleDonObjetService {

  readonly #stockService = inject(StockService);
  readonly #ventesService = inject(VentesService);
  readonly #donsService = inject(DonsService);
  readonly #router = inject(Router);

  donnerObjet(objet: Objet, infosDon: InfosDon) {
    return this.#stockService.donnerObjet(objet)
    .pipe(
      // Annulation autres ventes sur le même objet
      mergeMap(() => {
        return this.#ventesService.annulerVentesObjet(objet.id!);
      }),
      // Ajout don
      mergeMap(() => {
        return this.#donsService.ajouterDon(objet.id!, infosDon);
      }),
      // Navigation vers page des dons
      tap(() => {
        this.#router.navigate(['dons']);
      }),
    );
  }
}
