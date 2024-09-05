// Référentiel
export type Referentiel = {
  id?: number;
  type: string;
  code: string;
  libelle: string;
  estModifiable: boolean;
};

export type ReferentielDb = {
  id: number;
  type: string;
  code: string;
  libelle: string;
  est_modifiable: boolean;
};

export type InfosReferentiel = {
  type: string;
  code: string | null;
  libelle: string | null;
  estModifiable: boolean;
};

export type FiltresReferentiel = {
  type?: string;
  code?: string;
  libelle?: string;
  estModifiable?: boolean;
};

// Don
export type Don = {
  id?: number;
  objet: Objet;
  destinataire: string;
  dateDon: Date;
};

export type DonDb = {
  id?: number;
  objet: number;
  dateDonation: Date;
  destinataire: string;
};

export type InfosDon = {
  dateDon: Date | null;
  destinataireDon: string | null;
};

export type FiltresDon = {
  infosObjet?: string;
  dateDon?: Date;
  destinataireDon?: string;
};

// Objet
export type Objet = {
  id?: number;
  categorie: Referentiel;
  description: string;
  infos?: string;
  emplacement: string;
  statutObjet: Referentiel;
};

export type ObjetDb = {
  id?: number;
  categorie: number;
  description: string;
  infos: string;
  emplacement: string;
  statutObjet: number;
};

export type InfosObjet = {
  categorie: Referentiel | null;
  description: string | null;
  infos: string | null;
  emplacement: string | null;
};

export type FiltresObjet = {
  categories?: Referentiel[];
  description?: string;
  infos?: string;
  emplacement?: string;
  statuts?: Referentiel[];
};

export type Livre = {
  isbn: string | null;
  titre: string | null;
  auteurs: string[];
};

// Vente
export type Vente = {
  id?: number;
  objet: Objet;
  plateforme: Referentiel;
  url: string;
  dateMiseEnVente: Date;
  delai: number;
  statutVente: Referentiel;
};

export type VenteDb = {
  id?: number;
  objet: number;
  plateformeVente: number;
  url: string;
  delai: number;
  statutVente: number;
  dateMiseEnVente: Date;
};

export type InfosVente = {
  plateformeVente: Referentiel | null;
  urlVente: string | null;
  dateMiseEnVente: Date | null;
  delaiVente: number | null;
};

export type FiltresVente = {
  infosObjet?: string;
  plateformesVente?: Referentiel[];
  urlVente?: string;
  dateMiseEnVente?: Date;
  dateLimiteDeVente?: Date;
  statuts?: Referentiel[];
};
