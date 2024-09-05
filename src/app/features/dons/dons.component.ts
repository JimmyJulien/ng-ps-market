import { Component, inject } from '@angular/core';
import { DonsService } from '@dons/dons.service';
import { FiltresDonsComponent } from "@dons/filtres-dons/filtres-dons.component";
import { ResultatsDonsComponent } from "@dons/resultats-dons/resultats-dons.component";
import { FiltresDon } from '@shared/types/app.types';

@Component({
  selector: 'app-dons',
  standalone: true,
  imports: [
    ResultatsDonsComponent,
    FiltresDonsComponent
],
  templateUrl: './dons.component.html',
  styleUrl: './dons.component.scss'
})
export class DonsComponent {

  readonly service = inject(DonsService);

  filtrer(filtres: FiltresDon): void {
    this.service.filtrerDons(filtres);
  }
}
