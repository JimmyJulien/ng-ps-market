import { inject, Injectable } from '@angular/core';
import { Vente } from '@shared/types/app.types';
import { VentesService } from '@ventes/ventes.service';

@Injectable({
  providedIn: 'root'
})
export class ModaleAnnulationVenteService {

  readonly ventesService = inject(VentesService);

  annulerVente(vente: Vente) {
    return this.ventesService.annulerVente(vente);
  }
}
