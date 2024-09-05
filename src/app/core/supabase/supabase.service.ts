import { Injectable } from "@angular/core";
import { environment } from "@environments/environment.development";
import { createClient } from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  readonly supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_KEY
  );

}
