import { inject, Injectable } from '@angular/core';
import { Objet } from '@shared/types/app.types';
import { StockService } from '@stock/stock.service';

@Injectable({
  providedIn: 'root'
})
export class ModaleModificationObjetService {
  
  readonly stockService = inject(StockService);

  modifierObjet(objet: Objet) {
    return this.stockService.modifierObjet(objet);
  }
}
