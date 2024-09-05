import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DonsService } from '@dons/dons.service';
import { AucunResultatIcone } from "@shared/icones/aucun-resultat.icone";
import { ChargementIcone } from "@shared/icones/chargement.icone";

@Component({
  selector: 'app-resultats-dons',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ChargementIcone,
    AucunResultatIcone
],
  templateUrl: './resultats-dons.component.html',
  styleUrl: './resultats-dons.component.scss'
})
export class ResultatsDonsComponent {
  
  readonly service = inject(DonsService);

  donsFiltres$ = this.service.donsFiltres$;
  estChargementDonneesEnCours$ = this.service.estChargementDonneesEnCours$;

}
