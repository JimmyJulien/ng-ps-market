import { Pipe, PipeTransform } from '@angular/core';
import { Vente } from '@shared/types/app.types';
import { AppUtils } from '@shared/utils/app.utils';

@Pipe({
  name: 'dateLimiteVente',
  standalone: true,
})
export class DateLimiteVentePipe implements PipeTransform {

  transform(vente: Vente | null): Date | null {
    return AppUtils.getDateLimiteDeVente(vente);
  }

}
