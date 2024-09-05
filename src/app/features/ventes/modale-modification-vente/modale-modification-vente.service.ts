import { inject, Injectable } from '@angular/core';
import { InfosVente, Vente } from '@shared/types/app.types';
import { VentesService } from '@ventes/ventes.service';

@Injectable({
  providedIn: 'root'
})
export class ModaleModificationVenteService {

  readonly ventesService = inject(VentesService);

  modifierVente(vente: Vente, infosVente: InfosVente) {
    return this.ventesService.modifierVente(vente, infosVente);
  }

}
