import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfosDon, Objet } from '@shared/types/app.types';
import { ModaleDonObjetService } from '@stock/modale-don-objet/modale-don-objet.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-don-objet',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modale-don-objet.component.html',
  styleUrl: './modale-don-objet.component.scss'
})
export class ModaleDonObjetComponent {

  readonly service = inject(ModaleDonObjetService);

  readonly CHAMP_INFOS_OBJET = 'infosObjet';
  readonly CHAMP_DATE_DON = 'dateDon';
  readonly CHAMP_DESTINATAIRE_DON = 'destinataireDon';

  modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  formulaire = new FormGroup({
    [this.CHAMP_INFOS_OBJET]: new FormControl<string | null>({value: null, disabled: true}),
    [this.CHAMP_DATE_DON]: new FormControl<Date | null>(null, Validators.required),
    [this.CHAMP_DESTINATAIRE_DON]: new FormControl<string | null>(null, Validators.required),
  });

  $objetADonner = input.required<Objet | null>();
  fermeture = output<void>();

  get controleInfosObjet(): FormControl<string | null> {
    return this.formulaire.controls[this.CHAMP_INFOS_OBJET];
  }

  get controleDateDon(): FormControl<Date | null> {
    return this.formulaire.controls[this.CHAMP_DATE_DON];
  }

  get controleDestinataireDon(): FormControl<string | null> {
    return this.formulaire.controls[this.CHAMP_DESTINATAIRE_DON];
  }

  constructor() {
    effect(() => {
      const objetADonner = this.$objetADonner();

      if(objetADonner) {
        this.controleInfosObjet.setValue(`${objetADonner.categorie} - ${objetADonner.description}`);

        this.modale()?.nativeElement?.showModal();
      }
    });
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const objetADonner = this.$objetADonner();
    const valeurFormulaire = this.formulaire.value;

    if(!objetADonner) {
      throw new Error("L'objet à donner doit être défini");
    }

    const infosDon: InfosDon = {
      dateDon: valeurFormulaire.dateDon || null,
      destinataireDon: valeurFormulaire.destinataireDon || null,
    };

    this.service.donnerObjet(objetADonner, infosDon)
    .pipe(
      tap(() => {
        this.#fermerModale();
      })
    )
    .subscribe();
  }

  #fermerModale(): void {
    this.formulaire.reset();
    this.modale()?.nativeElement?.close();
    this.fermeture.emit();
  }
}
