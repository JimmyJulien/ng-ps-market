import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReferentielsService } from '@referentiels/referentiels.service';
import { SelectionMultipleComponent } from "@shared/components/selection-multiple/selection-multiple.component";
import { FiltresObjet, Referentiel } from '@shared/types/app.types';
import { combineLatest, tap } from 'rxjs';

@Component({
  selector: 'app-filtres-stock',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgClass,
    SelectionMultipleComponent
],
  templateUrl: './filtres-stock.component.html',
  styleUrl: './filtres-stock.component.scss'
})
export class FiltresStockComponent {

  readonly #referentielsService = inject(ReferentielsService);

  readonly CHAMP_CATEGORIES = 'categories';
  readonly CHAMP_DESCRIPTION = 'description';
  readonly CHAMP_INFOS_COMPLEMENTAIRES = 'infosComplementaires';
  readonly CHAMP_EMPLACEMENT = 'emplacement';
  readonly CHAMP_STATUTS = 'statuts';

  categories$ = this.#referentielsService.getCategoriesVente();
  statutsObjet$ = this.#referentielsService.getStatutsObjet();

  get controleCategories() {
    return this.formulaireFiltres.controls[this.CHAMP_CATEGORIES];
  }

  get controleDescription() {
    return this.formulaireFiltres.controls[this.CHAMP_DESCRIPTION];
  }

  get controleInfosComplementaires() {
    return this.formulaireFiltres.controls[this.CHAMP_INFOS_COMPLEMENTAIRES];
  }

  get controleEmplacement() {
    return this.formulaireFiltres.controls[this.CHAMP_EMPLACEMENT];
  }

  get controleStatuts() {
    return this.formulaireFiltres.controls[this.CHAMP_STATUTS];
  }

  formulaireFiltres = new FormGroup({
    [this.CHAMP_CATEGORIES]: new FormControl<Referentiel[]>([]),
    [this.CHAMP_DESCRIPTION]: new FormControl<string | undefined>(undefined),
    [this.CHAMP_INFOS_COMPLEMENTAIRES]: new FormControl<string | undefined>(undefined),
    [this.CHAMP_EMPLACEMENT]: new FormControl<string | undefined>(undefined),
    [this.CHAMP_STATUTS]: new FormControl<Referentiel[]>([]),
  });

  $alignement = input<'vertical' | 'horizontal'>();

  filtrage = output<FiltresObjet>();

  constructor() {
    combineLatest([
      this.#referentielsService.getStatutObjetAVendre(),
      this.#referentielsService.getStatutObjetEnVente(),
    ])
    .pipe(
      tap(([statutObjetAVendre, statutObjetEnVente]) => {
        this.controleStatuts.setValue([statutObjetAVendre, statutObjetEnVente]);
        this.filtrer();
      })
    )
    .subscribe();
  }

  filtrer(): void {
    const filtres = this.formulaireFiltres.value;
    
    this.filtrage.emit({
      categories: filtres.categories || undefined,
      description: filtres.description || undefined,
      infos: filtres.infosComplementaires || undefined,
      emplacement: filtres.emplacement || undefined,
      statuts: filtres.statuts || undefined,
    });
  }
}
