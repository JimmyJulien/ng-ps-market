import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@app/core/supabase/supabase.service';
import { Don, DonDb, FiltresDon, InfosDon, Objet } from '@shared/types/app.types';
import { AppUtils } from '@shared/utils/app.utils';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { BehaviorSubject, combineLatest, from, map, mergeMap, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonsService {
  readonly #supabaseService = inject(SupabaseService);

  readonly TABLE_NAME = 'dons';

  #estChargementDonneesEnCours$ = new BehaviorSubject<boolean>(true);
  estChargementDonneesEnCours$ = this.#estChargementDonneesEnCours$.asObservable();

  #dons$ = new BehaviorSubject<Don[]>([]);
  don$ = this.#dons$.asObservable();

  #filtres$ = new BehaviorSubject<FiltresDon>({});

  donsFiltres$ = combineLatest([
    this.#dons$,
    this.#filtres$,
  ])
  .pipe(
    map(([dons, filtres]) => {
      let donsFiltres = [...dons];

      if(filtres.infosObjet) {
        donsFiltres = donsFiltres.filter(d => `${d.objet?.categorie} - ${d.objet?.description}`.includes(filtres.infosObjet!));
      }

      if(filtres.dateDon) {
        donsFiltres = donsFiltres.filter(d => {
          const dateDonDon = d.dateDon ? new Date(d.dateDon) : null;
          const dateDonFiltre = filtres.dateDon ? new Date(filtres.dateDon) : null;
          return AppUtils.verifierEgaliteDates(dateDonDon, dateDonFiltre);
        });
      }

      if(filtres.destinataireDon) {
        donsFiltres = donsFiltres.filter(d => d.destinataire?.includes(filtres.destinataireDon!));
      }

      return donsFiltres;
    })
  );

  constructor() {
    this.#initialiserDons();
  }

  #initialiserDons(): void {
    this.#estChargementDonneesEnCours$.next(true);

    this.getAllDons()
    .pipe(
      tap((dons) => {
        this.#dons$.next(dons);
        this.#estChargementDonneesEnCours$.next(false);
      })
    )
    .subscribe();
  }

  getAllDons(): Observable<Don[]> {
    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .select(`
        id,
        objet (*),
        destinataire,
        dateDonation
      `)
    )
    .pipe(
      map(reponse => this.#convertirReponseEnDons(reponse))
    );
  }

  #convertirReponseEnDons(reponse: PostgrestSingleResponse<any[]>): Don[] {
    if(!reponse.data) return [];

    return reponse.data
    .map(reponseData => {
      const id: number = reponseData.id;
      const objet: Objet = reponseData.objet;
      const destinataire: string = reponseData.destinataire;
      const dateDon: Date = reponseData.dateDonation;

      return {
        id,
        objet,
        destinataire,
        dateDon
      } as Don;
    });
  }

  filtrerDons(filtres: FiltresDon): void {
    this.#filtres$.next(filtres);
  }

  ajouterDon(idObjetADonner: number, infosDon: InfosDon): Observable<Don[]> {
    this.#estChargementDonneesEnCours$.next(true);

    const donPourDb: DonDb = {
      objet: idObjetADonner,
      destinataire: infosDon.destinataireDon!,
      dateDonation: infosDon.dateDon!,
    };

    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .insert([donPourDb])
    )
    .pipe(
      mergeMap(() => this.getAllDons()),
      tap((dons) => {
        this.#dons$.next(dons);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }
}
