import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { InfosObjet, Livre, Referentiel } from '@shared/types/app.types';
import { tap } from 'rxjs';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-modale-ajout-objet',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './modale-ajout-objet.component.html',
  styleUrl: './modale-ajout-objet.component.scss'
})
export class ModaleAjoutObjetComponent {
  
  readonly stockService = inject(StockService);
  readonly referentielsService = inject(ReferentielsService);

  readonly CHAMP_CATEGORIE = 'categorie';
  readonly CHAMP_DESCRIPTION = 'description';
  readonly CHAMP_INFOS_COMPLEMENTAIRES = 'infosComplementaires';
  readonly CHAMP_EMPLACEMENT = 'emplacement';

  categories$ = this.referentielsService.getCategoriesVente();

  modale$ = viewChild<ElementRef<HTMLDialogElement>>('modale');

  formulaire = new FormGroup({
    [this.CHAMP_CATEGORIE]: new FormControl<Referentiel | null>(null, Validators.required),
    [this.CHAMP_DESCRIPTION]: new FormControl<string | null>(null, Validators.required),
    [this.CHAMP_INFOS_COMPLEMENTAIRES]: new FormControl<string | null>(null),
    [this.CHAMP_EMPLACEMENT]: new FormControl<string | null>(null, Validators.required),
  });

  ouvrir$ = input<boolean>(false);
  fermeture = output<void>();

  get controleCategorie(): FormControl<Referentiel | null> {
    return this.formulaire.controls[this.CHAMP_CATEGORIE];
  }

  get controleDescription(): FormControl<string | null> {
    return this.formulaire.controls[this.CHAMP_DESCRIPTION];
  }

  get controleInfosComplementaires(): FormControl<string | null> {
    return this.formulaire.controls[this.CHAMP_INFOS_COMPLEMENTAIRES];
  }

  get controleEmplacement(): FormControl<string | null> {
    return this.formulaire.controls[this.CHAMP_EMPLACEMENT];
  }

  constructor() {
    effect(() => {
      if(this.ouvrir$()) {
        this.modale$()?.nativeElement?.showModal();
      }
    });
  }

  chercher() {
    const isbn = this.controleDescription.value || null;

    if(!isbn) {
      throw new Error("L'ISBN du livre à chercher doit être défini");
    }

    this.stockService.trouverLivreParIsbn(isbn)
    .pipe(
      tap((livre: Livre | null) => {
        if(!livre) {
          return;
        }

        this.controleDescription.setValue(livre.titre);
        this.controleInfosComplementaires.setValue(livre.auteurs.join(', '));
      })
    )
    .subscribe();
  }

  annuler() {
    this.#fermerModale();
  }

  valider() {
    const valeurFormulaire = this.formulaire.value;

    const infosObjet: InfosObjet = {
      categorie: valeurFormulaire.categorie || null,
      description: valeurFormulaire.description || null,
      infos: valeurFormulaire.infosComplementaires || null,
      emplacement: valeurFormulaire.emplacement || null
    };

    this.stockService.ajouterObjet(infosObjet)
    .pipe(
      tap(() => {
        this.#fermerModale();
      })
    )
    .subscribe();
  }

  #fermerModale(): void {
    this.formulaire.reset();
    this.modale$()?.nativeElement?.close();
    this.fermeture.emit();
  }
}
