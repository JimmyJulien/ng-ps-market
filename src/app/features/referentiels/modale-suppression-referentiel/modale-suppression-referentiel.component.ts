import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { Referentiel } from '@shared/types/app.types';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-suppression-referentiel',
  standalone: true,
  imports: [],
  templateUrl: './modale-suppression-referentiel.component.html',
  styleUrl: './modale-suppression-referentiel.component.scss'
})
export class ModaleSuppressionReferentielComponent {

  readonly referentielsService = inject(ReferentielsService);

  modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  $referentielASupprimer = input.required<Referentiel | null>();
  fermeture = output<void>();

  constructor() {
    effect(() => {
      const referentielASupprimer = this.$referentielASupprimer();

      if(referentielASupprimer) {
        this.modale()?.nativeElement?.showModal();
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const referentielASupprimer = this.$referentielASupprimer();

    if(!referentielASupprimer) {
      throw new Error("La valeur à supprimer doit être définie");
    }

    this.referentielsService.supprimerReferentiel(referentielASupprimer)
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
