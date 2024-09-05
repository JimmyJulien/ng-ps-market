import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ReferentielsService } from '@app/features/referentiels/referentiels.service';
import { ArgentIcone } from "@shared/icones/argent.icone";
import { AucunResultatIcone } from "@shared/icones/aucun-resultat.icone";
import { ChargementIcone } from "@shared/icones/chargement.icone";
import { CroixIcone } from "@shared/icones/croix.icone";
import { ModificationIcone } from "@shared/icones/modification.icone";
import { Vente } from '@shared/types/app.types';
import { DateLimiteVentePipe } from '@ventes/date-limite-vente.pipe';
import { VentesService } from '@ventes/ventes.service';

@Component({
  selector: 'app-resultats-ventes',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    DateLimiteVentePipe,
    ChargementIcone,
    AucunResultatIcone,
    ModificationIcone,
    ArgentIcone,
    CroixIcone
],
  templateUrl: './resultats-ventes.component.html',
  styleUrl: './resultats-ventes.component.scss'
})
export class ResultatsVentesComponent {

  readonly #service = inject(VentesService);
  readonly #referentielsService = inject(ReferentielsService);

  readonly statutVenteEnCours$ = this.#referentielsService.getStatutVenteEnCours();

  ventesFiltrees$ = this.#service.ventesFiltrees$;
  estChargementDonneesEnCours$ = this.#service.estChargementDonneesEnCours$;

  modificationVente = output<Vente>();
  finalisationVente = output<Vente>();
  annulationVente = output<Vente>();

  modifierVente(vente: Vente): void {
    this.modificationVente.emit(vente);
  }

  finaliserVente(vente: Vente): void {
    this.finalisationVente.emit(vente);
  }

  annulerVente(vente: Vente): void {
    this.annulationVente.emit(vente);
  }
}
