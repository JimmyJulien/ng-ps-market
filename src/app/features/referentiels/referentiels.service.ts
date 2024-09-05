import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@app/core/supabase/supabase.service';
import { FiltresReferentiel, InfosReferentiel, Referentiel } from '@shared/types/app.types';
import { BehaviorSubject, combineLatest, from, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferentielsService {

  readonly #supabaseService = inject(SupabaseService);
  
  readonly TABLE_NAME = 'referentiels';
  readonly TYPE_CATEGORIE_OBJET = 'categorie_objet';
  readonly TYPE_PLATEFORME_VENTE = 'plateforme_vente';
  readonly TYPE_STATUT_OBJET = 'statut_objet';
  readonly TYPE_STATUT_VENTE = 'statut_vente';

  #referentiels$ = new BehaviorSubject<Referentiel[]>([]);
  #filtres$ = new BehaviorSubject<FiltresReferentiel>({});
  #estChargementDonneesEnCours$ = new BehaviorSubject<boolean>(true);

  constructor() {
    this.#initialiserReferentiels();
  }

  #initialiserReferentiels(): void {
    this.#estChargementDonneesEnCours$.next(true);

    from(
      this.#supabaseService.supabase.from(this.TABLE_NAME).select('*')
    )
    .pipe(
      map(reponse => reponse.data as Referentiel[]),
      tap((referentiels) => {
        this.#referentiels$.next(referentiels);
        this.#estChargementDonneesEnCours$.next(false);
      })
    )
    .subscribe();
  }

  getReferentiels(): Observable<Referentiel[]> {
    return this.#referentiels$.asObservable();
  }

  getReferentielsFiltres(): Observable<Referentiel[]> {
    return combineLatest([
      this.#referentiels$,
      this.#filtres$,
    ])
    .pipe(
      map(([referentiels, filtres]) => {
        let referentielsFiltres = [...referentiels];
  
        if(filtres.type) {
          referentielsFiltres.filter(r => r.type?.includes(filtres.type!));
        }
  
        if(filtres.code) {
          referentielsFiltres.filter(r => r.code?.includes(filtres.code!));
        }
  
        if(filtres.libelle) {
          referentielsFiltres.filter(r => r.libelle?.includes(filtres.libelle!));
        }
  
        if(filtres.estModifiable) {
          referentielsFiltres.filter(r => r.estModifiable || false === filtres.estModifiable || false);
        }
  
        return referentielsFiltres;
      })
    );
  }
  
  getCategoriesVente(): Observable<Referentiel[]> {
    return this.#referentiels$
    .pipe(
      map(referentiels => {
        if(!referentiels || referentiels.length === 0) {
          return [];
        }
  
        return referentiels.filter(r => r.type === this.TYPE_CATEGORIE_OBJET);
      })
    );
  }

  getPlateformesVente(): Observable<Referentiel[]> {
    return this.#referentiels$
    .pipe(
      map(referentiels => {
        if(!referentiels || referentiels.length === 0) {
          return [];
        }
  
        return referentiels.filter(r => r.type === this.TYPE_PLATEFORME_VENTE);
      })
    );
  }

  getStatutsObjet(): Observable<Referentiel[]> {
    return this.#referentiels$
    .pipe(
      map(referentiels => {
        if(!referentiels || referentiels.length === 0) {
          return [];
        }
  
        return referentiels.filter(r => r.type === this.TYPE_STATUT_OBJET);
      })
    );
  }

  getStatutObjetAVendre(): Observable<Referentiel> {
    return this.getStatutsObjet()
    .pipe(
      map(statutsObjet => {
        return statutsObjet.find(r => r.code === 'a_vendre')!;
      })
    );
  }

  getStatutObjetEnVente(): Observable<Referentiel> {
    return this.getStatutsObjet()
    .pipe(
      map(statutsObjet => {
        return statutsObjet.find(r => r.code === 'en_vente')!;
      })
    );
  }

  getStatutObjetVendu(): Observable<Referentiel> {
    return this.getStatutsObjet()
    .pipe(
      map(statutsObjet => {
        return statutsObjet.find(r => r.code === 'vendu')!;
      })
    );
  }

  getStatutObjetDonne(): Observable<Referentiel> {
    return this.getStatutsObjet()
    .pipe(
      map(statutsObjet => {
        return statutsObjet.find(r => r.code === 'donne')!;
      })
    );
  }

  getStatutsVente(): Observable<Referentiel[]> {
    return this.#referentiels$
    .pipe(
      map(referentiels => {
        if(!referentiels || referentiels.length === 0) {
          return [];
        }
  
        return referentiels.filter(r => r.type === this.TYPE_STATUT_VENTE);
      })
    );
  }

  getStatutVenteAnnulee(): Observable<Referentiel> {
    return this.getStatutsVente()
    .pipe(
      map(statutsVente => {
        return statutsVente.find(r => r.code === 'annulee')!;
      })
    );
  }

  getStatutVenteEnCours(): Observable<Referentiel> {
    return this.getStatutsVente()
    .pipe(
      map(statutsVente => {
        return statutsVente.find(r => r.code === 'en_cours')!;
      })
    );
  }

  getStatutVenteFinalisee(): Observable<Referentiel> {
    return this.getStatutsVente()
    .pipe(
      map(statutsVente => {
        return statutsVente.find(r => r.code === 'finalisee')!;
      })
    );
  }

  getEstChargementEnCours(): Observable<boolean> {
    return this.#estChargementDonneesEnCours$.asObservable();
  }

  filtrerReferentiels(filtres: FiltresReferentiel): void {
    this.#filtres$.next(filtres);
  }

  ajouterReferentiel(infosReferentiel: InfosReferentiel): Observable<Referentiel[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .insert([infosReferentiel])
      .select()
    )
    .pipe(
      map(reponse => reponse.data as Referentiel[]),
      tap((referentiels) => {
        this.#referentiels$.next(referentiels);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }

  modifierReferentiel(referentielAModifier: Referentiel): Observable<Referentiel[]> {
    this.#estChargementDonneesEnCours$.next(true);
    
    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .update(referentielAModifier)
      .eq('id', referentielAModifier.id)
      .select()
    )
    .pipe(
      map(reponse => reponse.data as Referentiel[]),
      tap((referentiels) => {
        this.#referentiels$.next(referentiels);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }

  supprimerReferentiel(referentielASupprimer: Referentiel): Observable<Referentiel[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', referentielASupprimer.id)
      .select()
    )
    .pipe(
      map(reponse => reponse.data as Referentiel[]),
      tap((referentiels) => {
        this.#referentiels$.next(referentiels);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }

  verifierExistenceReferentiel(referentielAVerifier: Referentiel): Observable<boolean> {
    return from(
      this.#supabaseService.supabase.from(this.TABLE_NAME)
      .select('*')
      .eq('id', referentielAVerifier.id)
    )
    .pipe(
      map(reponse => {
        return reponse.data && reponse.data.length > 0 || false;
      })
    );
  }
}
