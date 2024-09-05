import { AsyncPipe } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { Objet, Referentiel } from '@shared/types/app.types';
import { ModaleModificationObjetService } from '@stock/modale-modification-objet/modale-modification-objet.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modale-modification-objet',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './modale-modification-objet.component.html',
  styleUrl: './modale-modification-objet.component.scss'
})
export class ModaleModificationObjetComponent {

  readonly service = inject(ModaleModificationObjetService);
  readonly referentielsService = inject(ReferentielsService);

  readonly categories$ = this.referentielsService.getCategoriesVente();
  readonly CHAMP_CATEGORIE = 'categorie';
  readonly CHAMP_DESCRIPTION = 'description';
  readonly CHAMP_INFOS_COMPLEMENTAIRES = 'infosComplementaires';
  readonly CHAMP_EMPLACEMENT = 'emplacement';

  $modale = viewChild<ElementRef<HTMLDialogElement>>('modale');

  formulaire = new FormGroup({
    [this.CHAMP_CATEGORIE]: new FormControl<Referentiel | null>(null, Validators.required),
    [this.CHAMP_DESCRIPTION]: new FormControl<string | null>(null, Validators.required),
    [this.CHAMP_INFOS_COMPLEMENTAIRES]: new FormControl<string | null>(null),
    [this.CHAMP_EMPLACEMENT]: new FormControl<string | null>(null),
  });
  
  $objetAModifier = input<Objet | null>(null);
  fermeture = output<void>();

  get controleCategorie() {
    return this.formulaire.controls[this.CHAMP_CATEGORIE];
  }

  get controleDescription() {
    return this.formulaire.controls[this.CHAMP_DESCRIPTION];
  }

  get controleInfosComplementaires() {
    return this.formulaire.controls[this.CHAMP_INFOS_COMPLEMENTAIRES];
  }

  get controleEmplacement(){
    return this.formulaire.controls[this.CHAMP_EMPLACEMENT];
  }

  constructor() {
    effect(() => {
      const objetAModifier = this.$objetAModifier();

      if(objetAModifier) {
        this.controleCategorie.setValue(objetAModifier.categorie);
        this.controleDescription.setValue(objetAModifier.description);
        this.controleInfosComplementaires.setValue(objetAModifier.infos || null);
        this.controleEmplacement.setValue(objetAModifier.emplacement);

        this.$modale()?.nativeElement?.showModal();
      }
    });
  }

  modifierObjet(objet: Objet): void {
    this.controleCategorie.setValue(objet.categorie);
    this.controleDescription.setValue(objet.description);
    this.controleInfosComplementaires.setValue(objet.infos || null);
    this.controleEmplacement.setValue(objet.emplacement);

    this.$modale()?.nativeElement?.showModal();
  }

  annuler(): void {
    this.#fermerModale();
  }

  valider(): void {
    const valeurFormulaire = this.formulaire.value;
    const objetAModifier = this.$objetAModifier();

    if(!objetAModifier) {
      return;
    }

    this.service.modifierObjet({
      ...objetAModifier,
      categorie: valeurFormulaire.categorie!,
      description: valeurFormulaire.description!,
      infos: valeurFormulaire.infosComplementaires!,
      emplacement: valeurFormulaire.emplacement!,
    })
    .pipe(
      tap(() => {
        this.#fermerModale();
      })
    )
    .subscribe();
  }

  #fermerModale(): void {
    this.formulaire.reset();
    this.$modale()?.nativeElement?.close();
    this.fermeture.emit();
  }
}
