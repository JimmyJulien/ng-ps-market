import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { Vente } from '@shared/types/app.types';
import { ModaleFinalisationVenteService } from '@ventes/modale-finalisation-vente/modale-finalisation-vente.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-finalisation-vente',
  standalone: true,
  imports: [],
  templateUrl: './modale-finalisation-vente.component.html',
  styleUrl: './modale-finalisation-vente.component.scss'
})
export class ModaleFinalisationVenteComponent {

  readonly service = inject(ModaleFinalisationVenteService);

  modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  $venteAFinaliser = input.required<Vente | null>();
  fermeture = output<void>();

  constructor() {
    effect(() => {
      if(this.$venteAFinaliser()) {
        this.modale()?.nativeElement?.showModal();
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const venteAFinaliser = this.$venteAFinaliser();

    if(!venteAFinaliser) {
      throw new Error("La vente à finaliser doit être définie");
    }

    this.service.finaliserVente(venteAFinaliser)
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
