import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/**
 * Thin wrapper around the Supabase client. Domain services build on top of this
 * and are the only place where query logic lives.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  /** Session handling is disabled because the app has no login. */
  readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
