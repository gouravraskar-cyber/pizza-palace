import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey,
      {
        auth: {
          persistSession: false,  // Disable session persistence to avoid lock issues
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}

