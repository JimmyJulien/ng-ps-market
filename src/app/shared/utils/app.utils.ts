import { Vente } from "../types/app.types";

export class AppUtils {

  private constructor() {}

  static verifierEgaliteDates(date1: Date | null, date2: Date | null): boolean {
    if(!date1 && !date2) {
      return true;
    }
    else if(!date1 && date2) {
      return false;
    }
    else if(date1 && !date2) {
      return false;
    }
    else {
      return date1!.getFullYear() === date2!.getFullYear()
        && date1!.getMonth() === date2!.getMonth()
        && date1!.getDate() === date2!.getDate();
    }
  }

  static verifierListeVide(liste: unknown[] | undefined | null): boolean {
    return !liste || liste.filter(i => !!i).length === 0;
  }

  static getDateLimiteDeVente(vente: Vente | null): Date | null {
    if(!vente || !vente.dateMiseEnVente || !vente.delai) return null;

    const dateLimite = new Date(vente.dateMiseEnVente!);
    dateLimite.setDate(dateLimite.getDate() + vente.delai);
    return dateLimite;
  }
}