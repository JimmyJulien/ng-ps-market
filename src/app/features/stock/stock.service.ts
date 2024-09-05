import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '@app/core/supabase/supabase.service';
import { environment } from '@environments/environment';
import { FiltresObjet, InfosObjet, Livre, Objet, ObjetDb, Referentiel } from '@shared/types/app.types';
import { AppUtils } from '@shared/utils/app.utils';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { BehaviorSubject, catchError, combineLatest, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { ReferentielsService } from '../referentiels/referentiels.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  readonly #supabaseService = inject(SupabaseService);
  readonly #http = inject(HttpClient);
  readonly #referentielsService = inject(ReferentielsService);

  readonly TABLE_NAME = 'objets';

  #estChargementDonneesEnCours$ = new BehaviorSubject<boolean>(true);

  #objets$ = new BehaviorSubject<Objet[]>([]);

  #filtres$ = new BehaviorSubject<FiltresObjet>({});

  #isbnLivreCherche$ = new BehaviorSubject<string | null>(null);

  constructor() {
    this.#initialiserObjets();
  }

  #initialiserObjets(): void {
    this.#estChargementDonneesEnCours$.next(true);

    this.getAllObjets()
    .pipe(
      tap((objets) => {
        this.#objets$.next(objets);
        this.#estChargementDonneesEnCours$.next(false);
      })
    )
    .subscribe();
  }

  getAllObjets(): Observable<Objet[]> {
    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .select(`
        id,
        categorie (*),
        description,
        infos,
        emplacement,
        statutObjet (*)
      `)
    )
    .pipe(
      map(reponse => this.#convertirReponseEnObjets(reponse))
    );
  }

  #convertirReponseEnObjets(reponse: PostgrestSingleResponse<any[]>): Objet[] {
    if(!reponse.data) return [];

    return reponse.data
    .map(reponseData => {
      const id: number = reponseData.id;
      const categorie: Referentiel = reponseData.categorie;
      const description: string = reponseData.description;
      const infos: string = reponseData.infos;
      const emplacement: string = reponseData.emplacement;
      const statut: Referentiel = reponseData.statutObjet;

      return {
        id,
        categorie,
        description,
        infos,
        emplacement,
        statutObjet: statut
      } as Objet;
    });
  }

  filtrerObjets(filtres: FiltresObjet): void {
    this.#filtres$.next(filtres);
  }

  getObjetFiltres(): Observable<Objet[]> {
    return combineLatest([
      this.#objets$,
      this.#filtres$,
    ])
    .pipe(
      map(([objets, filtres]) => {
        let objetsFiltres = [...objets].filter(o => !!o);
  
        if(!AppUtils.verifierListeVide(filtres.categories)) {
          const listeIdCategorieFiltres = filtres.categories!.filter(c => !!c).map(c => c.id) || [];
          objetsFiltres = objetsFiltres.filter(o => listeIdCategorieFiltres.includes(o.categorie.id));
        }
        
        if(filtres.description) {
          objetsFiltres = objetsFiltres.filter(o => o.description?.includes(filtres.description!));
        }
        
        if(filtres.infos) {
          objetsFiltres = objetsFiltres.filter(o => o.infos?.includes(filtres.infos!));
        }
        
        if(filtres.emplacement) {
          objetsFiltres = objetsFiltres.filter(o => o.emplacement?.includes(filtres.emplacement!));
        }
        
        if(!AppUtils.verifierListeVide(filtres.statuts)) {
          const listeIdStatutObjetFiltres = filtres.statuts!.filter(s => !!s).map(s => s.id);
          objetsFiltres = objetsFiltres.filter(o => listeIdStatutObjetFiltres.includes(o.statutObjet.id));
        }
  
        return objetsFiltres;
      })
    );
  }

  getEstChargementEnCours(): Observable<boolean> {
    return this.#estChargementDonneesEnCours$.asObservable();
  }

  chercherLivreParIsbn(isbn: string | null): void {
    this.#isbnLivreCherche$.next(isbn);
  }

  trouverLivreParIsbn(isbn: string): Observable<Livre | null> {
    return this.#http.get<any>(`${environment.URL_RECHERCHE_LIVRE}${isbn}`)// TODO type get
    .pipe(
      map(reponse => {
        if(!reponse || Object.keys(reponse).length === 0) {
          return null;
        }
        
        const code = `ISBN:${isbn}`;
        const reponseLivre = reponse[code];

        const livre: Livre = {
          isbn,
          titre: reponseLivre.details.title,
          auteurs: reponseLivre.details.authors?.map((a: any) => a.name) || [],
        };

        return livre;
      }),
      catchError(erreur => {
        console.error(erreur);
        return of(null);
      })
    );
  }

  getLivrePourIsbn(): Observable<Livre | null> {
    return this.#isbnLivreCherche$
    .pipe(
      switchMap(isbn => {
        if(!isbn) return of(null);
        return this.trouverLivreParIsbn(isbn);
      })
    );
  }

  ajouterObjet(infosObjetAAjouter: InfosObjet): Observable<Objet[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return this.#referentielsService.getStatutObjetAVendre()
    .pipe(
      map(statutObjetAVendre => {
        // Création de l'objet à ajouter
        return {
          categorie: infosObjetAAjouter.categorie!.id!,
          description: infosObjetAAjouter.description!,
          infos: infosObjetAAjouter.infos || null,
          emplacement: infosObjetAAjouter.emplacement!,
          statutObjet: statutObjetAVendre.id!
        } as ObjetDb;
      }),
      mergeMap(objetAAjouter => {
        return from(
          this.#supabaseService.supabase
          .from(this.TABLE_NAME)
          .insert([objetAAjouter])
        )
        .pipe(
          mergeMap(() => this.getAllObjets()),
          tap((objets) => {
            this.#objets$.next(objets);
          }),
          tap(() => {
            this.#estChargementDonneesEnCours$.next(false);
          })
        );
      })
    );
  }

  modifierObjet(objetAModifier: Objet): Observable<Objet[]> {
    this.#estChargementDonneesEnCours$.next(true);

    const objetAModifierPourDb: ObjetDb = {
      id: objetAModifier.id!,
      categorie: objetAModifier.categorie.id!,
      description: objetAModifier.description,
      infos: objetAModifier.infos || '',
      emplacement: objetAModifier.emplacement,
      statutObjet: objetAModifier.statutObjet.id!,
    };

    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .update(objetAModifierPourDb)
      .eq('id', objetAModifierPourDb.id)
    )
    .pipe(
      mergeMap(() => this.getAllObjets()),
      tap((objets) => {
        this.#objets$.next(objets);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }

  mettreObjetEnVente(objetAMettreEnVente: Objet): Observable<Objet[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return this.#referentielsService.getStatutObjetEnVente()
    .pipe(
      // Mise à jour statut objet de l'objet à mettre en vente
      map(statutObjetEnVente => {
        const objetAVendre: Objet = {
          ...objetAMettreEnVente,
          statutObjet: statutObjetEnVente,
        };
        return objetAVendre;
      }),
      mergeMap(objetAMettreEnVente => {
        return this.modifierObjet(objetAMettreEnVente);
      }),
      // Mise à jour stock
      mergeMap(() => this.getAllObjets()),
      tap((objets) => {
        this.#objets$.next(objets);
        this.#estChargementDonneesEnCours$.next(false);
      }),
    );
  }

  donnerObjet(objetADonner: Objet): Observable<Objet[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return this.#referentielsService.getStatutObjetDonne()
    .pipe(
      map(statutObjetDonne => {
        // Mise à jour statut objet
        const objetEnCoursDonation: Objet = {
          ...objetADonner,
          statutObjet: statutObjetDonne,
        };
        return objetEnCoursDonation;
      }),
      mergeMap(objetEnCoursDonation => {
        return this.modifierObjet(objetEnCoursDonation);
      }),
      // Mise à jour stock
      mergeMap(() => this.getAllObjets()),
      tap((objets) => {
        this.#objets$.next(objets);
        this.#estChargementDonneesEnCours$.next(false);
      }),
    );
  }

  supprimerObjet(objetASupprimer: Objet): Observable<Objet[]> {
    this.#estChargementDonneesEnCours$.next(true);

    return from(
      this.#supabaseService.supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', objetASupprimer.id)
    )
    .pipe(
      mergeMap(() => this.getAllObjets()),
      tap((objets) => {
        this.#objets$.next(objets);
        this.#estChargementDonneesEnCours$.next(false);
      })
    );
  }
}
