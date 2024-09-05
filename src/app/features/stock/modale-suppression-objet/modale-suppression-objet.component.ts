import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { Objet } from '@shared/types/app.types';
import { StockService } from '@stock/stock.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-suppression-objet',
  standalone: true,
  imports: [],
  templateUrl: './modale-suppression-objet.component.html',
  styleUrl: './modale-suppression-objet.component.scss'
})
export class ModaleSuppressionObjetComponent {
  
  readonly stockService = inject(StockService);

  modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  $objetASupprimer = input.required<Objet | null>();
  fermeture = output<void>();

  constructor() {
    effect(() => {
      const objetASupprimer = this.$objetASupprimer();

      if(objetASupprimer) {
        this.modale()?.nativeElement?.showModal();
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const objetASupprimer = this.$objetASupprimer();

    if(!objetASupprimer) {
      throw new Error("L'objet à supprimer doit être défini");
    }

    this.stockService.supprimerObjet(objetASupprimer)
    .pipe(
      tap(() => {
        this.#fermerModale();
      })
    )
    .subscribe();
  }

  #fermerModale(): void {
    this.modale()?.nativeElement?.close();
    this.fermeture.emit();
  }
}
