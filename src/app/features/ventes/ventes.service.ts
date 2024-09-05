import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@app/core/supabase/supabase.service';
import { FiltresVente, InfosVente, Objet, Referentiel, Vente, VenteDb } from '@shared/types/app.types';
import { AppUtils } from '@shared/utils/app.utils';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { BehaviorSubject, combineLatest, from, map, mergeMap, Observable, of, tap } from 'rxjs';
import { ReferentielsService } from '../referentiels/referentiels.service';

@Injectable({
  providedIn: 'root'
})
export class VentesService {

  readonly #supabaseService = inject(SupabaseService);
  readonly #referentielsService = inject(ReferentielsService);

  readonly TABLE_NAME = 'ventes';

  #estChargementDonneesEnCours$ = new BehaviorSubject<boolean>(true);
  estChargementDonneesEnCours$ = this.#estChargementDonneesEnCours$.asObservable();

  #ventes$ = new BehaviorSubject<Vente[]>([]);
  ventes$ = this.#ventes$.asObservable();

  #filtres$ = new BehaviorSubject<FiltresVente>({});

  ventesFiltrees$ = combineLatest([
    this.#ventes$,
    this.#filtres$,
  ])
  .pipe(
    map(([ventes, filtres]) => {
      let ventesFiltrees = [...ventes];

      if(!AppUtils.verifierListeVide(filtres.plateformesVente)) {
        ventesFiltrees = ventesFiltrees.filter(v => filtres.plateformesVente?.includes(v.plateforme!));
      }

      if(filtres.urlVente) {
        ventesFiltrees = ventesFiltrees.filter(v => v.url?.includes(filtres.urlVente!));
      }

      if(filtres.dateMiseEnVente) {
        ventesFiltrees = ventesFiltrees.filter(v => {
          const dateMiseEnVenteVente = v.dateMiseEnVente ? new Date(v.dateMiseEnVente) : null;
          const dateMiseEnVenteFiltre = filtres.dateMiseEnVente ? new Date(filtres.dateMiseEnVente) : null;
          return AppUtils.verifierEgaliteDates(dateMiseEnVenteFiltre, dateMiseEnVenteVente);
        });
      }

      if(filtres.dateLimiteDeVente) {
        ventesFiltrees = ventesFiltrees.filter(v => {
          const dateLimiteDeVenteVente = AppUtils.getDateLimiteDeVente(v);
          const dateLimiteDeVenteFiltre = new Date(filtres.dateLimiteDeVente!);
          return AppUtils.verifierEgaliteDates(dateLimiteDeVenteFiltre, dateLimiteDeVenteVente);
        });
      }

      if(!AppUtils.verifierListeVide(filtres.statuts)) {
        ventesFiltrees = ventesFiltrees.filter(v => filtres.statuts?.map(s => s.code).includes(v.statutVente!.code));
      }

      return ventesFiltrees;
    })
  );

  constructor() {
    this.#initialiserVentes();
  }

  #initialiserVentes(): void {
    this.#estChargementDonneesEnCours$.next(true);

    this.getAllVentes()
    .pipe(
      tap((ventes) => {
        this.#ventes$.next(ventes);
        this.#estChargementDonneesEnCours$.next(false);
      })
    )
    .subscribe();
  }

  getAllVentes(): Observable<Vente[]> {
    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .select(`
        id,
        objet (*),
        plateformeVente (*),
        url,
        delai,
        statutVente (*),
        dateMiseEnVente
      `)
    )
    .pipe(
      map(reponse => this.#convertirReponseEnVentes(reponse))
    );
  }

  #convertirReponseEnVentes(reponse: PostgrestSingleResponse<any[]>): Vente[] {
    if(!reponse.data) return [];

    return reponse.data
    .map(reponseData => {
      const id: number = reponseData.id;
      const objet: Objet = reponseData.objet;
      const plateforme: Referentiel = reponseData.plateformeVente;
      const url: string = reponseData.url;
      const delai: number = reponseData.delai;
      const statut: Referentiel = reponseData.statutVente;
      const dateMiseEnVente: Date = reponseData.dateMiseEnVente;

      return {
        id,
        objet,
        plateforme,
        url,
        delai,
        statutVente: statut,
        dateMiseEnVente
      } as Vente;
    });
  }

  filtrerVentes(filtres: FiltresVente): void {
    this.#filtres$.next(filtres);
  }

  ajouterVente(idObjetAMettreEnVente: number, infosVente: InfosVente): Observable<Vente[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return this.#referentielsService.getStatutVenteEnCours()
    .pipe(
      mergeMap(statutVenteEnCours => {
        // Création vente
        const venteAAjouterPourDb: VenteDb = {
          objet: idObjetAMettreEnVente,
          plateformeVente: infosVente.plateformeVente!.id!,
          url: infosVente.urlVente!,
          delai: infosVente.delaiVente!,
          statutVente: statutVenteEnCours.id!,
          dateMiseEnVente: infosVente.dateMiseEnVente!,
        };

        return from(
          this.#supabaseService.supabase
          .from(this.TABLE_NAME)
          .insert([venteAAjouterPourDb])
        );
      }),
      mergeMap(() => this.getAllVentes()),
      tap((ventes) => {
        this.#ventes$.next(ventes);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }

  modifierVente(venteAModifier: Vente, infosVente?: InfosVente, avecRechargement = true): Observable<Vente[]> {
    this.#estChargementDonneesEnCours$.next(true);

    let venteModifiee = {...venteAModifier};

    if(infosVente) {
      venteModifiee = {
        ...venteAModifier,
        plateforme: infosVente.plateformeVente!,
        url: infosVente.urlVente!,
        delai: infosVente.delaiVente!,
        dateMiseEnVente: infosVente.dateMiseEnVente!,
      };
    }

    const venteAModifierPourDb: VenteDb = {
      id: venteModifiee.id!,
      objet: venteModifiee.objet.id!,
      plateformeVente: venteModifiee.plateforme.id!,
      url: venteModifiee.url,
      delai: venteModifiee.delai,
      statutVente: venteModifiee.statutVente.id!,
      dateMiseEnVente: venteModifiee.dateMiseEnVente
    };
    
    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .update(venteAModifierPourDb)
      .eq('id', venteAModifierPourDb.id)
    )
    .pipe(
      mergeMap(() => this.getAllVentes()),
      tap((ventes) => {
        if(avecRechargement) {
          this.#ventes$.next(ventes);
        }
        this.#estChargementDonneesEnCours$.next(false);
      })
    );

  }

  finaliserVente(venteAFinaliser: Vente): Observable<Vente[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return this.#referentielsService.getStatutVenteFinalisee()
    .pipe(
      map(statutVenteFinalisee => {
        // Mise à jour statut vente
        const vente: Vente = {
          ...venteAFinaliser,
          statutVente: statutVenteFinalisee
        };

        return vente;
      }),
      mergeMap(venteAFinaliser => {
        return combineLatest([
          this.modifierVente(venteAFinaliser, undefined, false),// Maj statut vente à finaliser
          this.annulerVentesObjet(venteAFinaliser.objet.id!, venteAFinaliser.id!)// Maj statut autres ventes sur même objet
        ]);
      }),
      // Mise à jour des ventes
      mergeMap(() => this.getAllVentes()),
      tap(ventes => {
        this.#ventes$.next(ventes);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }

  annulerVente(venteAAnnuler: Vente, avecRechargement = true): Observable<Vente[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return this.#referentielsService.getStatutVenteAnnulee()
    .pipe(
      map(statutVenteAnnulee => {
        // Mise à jour statut vente
        const venteEnCoursAnnulation: Vente = {
          ...venteAAnnuler,
          statutVente: statutVenteAnnulee
        };

        return venteEnCoursAnnulation;
      }),
      mergeMap(venteAAnnuler => {
        return this.modifierVente(venteAAnnuler, undefined, avecRechargement);
      })
    );
  }

  annulerVentesObjet(idObjet: number, idVente: number | null = null) {
    const ventesSurMemeObjet = this.#ventes$.value.filter(
      v => v.objet?.id === idObjet && v.id !== idVente
    );

    if(ventesSurMemeObjet.length === 0) return of(null);

    return combineLatest(
      ventesSurMemeObjet.map(v => this.annulerVente(v, false))
    )
    .pipe(
      // Mise à jour des ventes
      mergeMap(() => this.getAllVentes()),
      tap(ventes => {
        this.#ventes$.next(ventes);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }
}
