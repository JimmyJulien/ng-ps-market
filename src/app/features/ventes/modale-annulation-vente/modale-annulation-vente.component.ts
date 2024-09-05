import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { Vente } from '@shared/types/app.types';
import { ModaleAnnulationVenteService } from '@ventes/modale-annulation-vente/modale-annulation-vente.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-annulation-vente',
  standalone: true,
  imports: [],
  templateUrl: './modale-annulation-vente.component.html',
  styleUrl: './modale-annulation-vente.component.scss'
})
export class ModaleAnnulationVenteComponent {

  readonly service = inject(ModaleAnnulationVenteService);

  modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  $venteAAnnuler = input.required<Vente | null>();
  fermeture = output<void>();

  constructor() {
    effect(() => {
      if(this.$venteAAnnuler()) {
        this.modale()?.nativeElement?.showModal();
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const venteAFinaliser = this.$venteAAnnuler();

    if(!venteAFinaliser) {
      throw new Error("La vente à finaliser doit être définie");
    }

    this.service.annulerVente(venteAFinaliser)
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
