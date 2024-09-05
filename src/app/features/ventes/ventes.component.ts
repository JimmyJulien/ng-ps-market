import { Component, inject } from '@angular/core';
import { FiltresVente, Vente } from '@shared/types/app.types';
import { FiltresVentesComponent } from "@ventes/filtres-ventes/filtres-ventes.component";
import { ModaleAnnulationVenteComponent } from "@ventes/modale-annulation-vente/modale-annulation-vente.component";
import { ModaleFinalisationVenteComponent } from "@ventes/modale-finalisation-vente/modale-finalisation-vente.component";
import { ModaleModificationVenteComponent } from "@ventes/modale-modification-vente/modale-modification-vente.component";
import { ResultatsVentesComponent } from "@ventes/resultats-ventes/resultats-ventes.component";
import { VentesService } from '@ventes/ventes.service';

// Fonctionnalités :
// - voir liste ventes (OK)
// - filtrer les ventes (OK)
// - modifier une vente (plateforme, url, mise en vente, delai vente) (OK)
// - finaliser une vente (OK)
// - annuler une vente (OK)

@Component({
  selector: 'app-ventes',
  standalone: true,
  imports: [
    FiltresVentesComponent,
    ResultatsVentesComponent,
    ModaleModificationVenteComponent,
    ModaleFinalisationVenteComponent,
    ModaleAnnulationVenteComponent,
],
  templateUrl: './ventes.component.html',
  styleUrl: './ventes.component.scss'
})
export class VentesComponent {

  readonly service = inject(VentesService);

  venteAModifier: Vente | null = null;
  venteAAnnuler: Vente | null = null;
  venteAFinaliser: Vente | null = null;

  filtrer(filtres: FiltresVente): void {
    this.service.filtrerVentes(filtres);
  }

  modifierVente(vente: Vente): void {
    this.venteAModifier = vente;
  }

  finaliserVente(vente: Vente): void {
    this.venteAFinaliser = vente;
  }

  annulerVente(vente: Vente): void {
    this.venteAAnnuler = vente;
  }
}
