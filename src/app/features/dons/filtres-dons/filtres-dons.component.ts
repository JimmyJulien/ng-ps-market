import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FiltresDon } from '@shared/types/app.types';

@Component({
  selector: 'app-filtres-dons',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filtres-dons.component.html',
  styleUrl: './filtres-dons.component.scss'
})
export class FiltresDonsComponent {

  readonly CHAMP_INFOS_OBJET = 'infosObjet';
  readonly CHAMP_DATE_DON = 'dateDon';
  readonly CHAMP_DESTINATAIRE_DON = 'destinataireDon';

  get controleInfosObjet(): FormControl<string | null> {
    return this.formulaireFiltres.controls[this.CHAMP_INFOS_OBJET];
  }

  get controleDateDon(): FormControl<Date | null> {
    return this.formulaireFiltres.controls[this.CHAMP_DATE_DON];
  }

  get controleDestinataireDon(): FormControl<string | null> {
    return this.formulaireFiltres.controls[this.CHAMP_DESTINATAIRE_DON];
  }

  formulaireFiltres = new FormGroup({
    [this.CHAMP_INFOS_OBJET]: new FormControl<string | null>(null),
    [this.CHAMP_DATE_DON]: new FormControl<Date | null>(null),
    [this.CHAMP_DESTINATAIRE_DON]: new FormControl<string | null>(null),
  });

  filtrage = output<FiltresDon>();

  filtrer(): void {
    const valeurFormulaire = this.formulaireFiltres.value;

    const filtres: FiltresDon = {
      infosObjet: valeurFormulaire.infosObjet || undefined,
      dateDon: valeurFormulaire.dateDon || undefined,
      destinataireDon: valeurFormulaire.destinataireDon || undefined,
    };

    this.filtrage.emit(filtres);
  }

}
