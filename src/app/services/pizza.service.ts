import { Injectable, inject, signal, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Pizza, PIZZAS } from '../data/pizza.data';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private supabaseService = inject(SupabaseService);
  private ngZone = inject(NgZone);

  private pizzas = signal<Pizza[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  // Public readonly signals
  readonly items = this.pizzas.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  constructor() {
    this.loadPizzas();
  }

  async loadPizzas(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.supabaseService.client
        .from('pizzas')
        .select('*')
        .order('id');

      if (error) throw error;

      // Run inside NgZone to trigger change detection
      this.ngZone.run(() => {
        if (data && data.length > 0) {
          // Map Supabase data to Pizza interface with safe defaults
          const mappedPizzas: Pizza[] = data.map(item => {
            // Ensure price is a valid number
            let price = 0;
            if (item.price !== null && item.price !== undefined) {
              price = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price);
            }
            if (isNaN(price)) price = 0;

            // Ensure ingredients is always an array
            let ingredients: string[] = [];
            if (Array.isArray(item.ingredients)) {
              ingredients = item.ingredients;
            } else if (typeof item.ingredients === 'string') {
              ingredients = [item.ingredients];
            }

            return {
              id: item.id,
              name: item.name || 'Unknown Pizza',
              description: item.description || '',
              price: price,
              imageUrl: item.image_url || 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
              isVeg: item.is_vegetarian ?? false,
              ingredients: ingredients
            };
          });
          console.log('Loaded pizzas from Supabase:', mappedPizzas.length, mappedPizzas);
          this.pizzas.set(mappedPizzas);
        } else {
          // Fallback to local data if Supabase is empty
          console.warn('No pizzas found in Supabase, using local data');
          this.pizzas.set(PIZZAS);
        }
      });
    } catch (err: any) {
      console.error('Error loading pizzas:', err);
      this.ngZone.run(() => {
        this.error.set(err.message || 'Failed to load pizzas');
        // Fallback to local data on error
        this.pizzas.set(PIZZAS);
      });
    } finally {
      this.ngZone.run(() => {
        this.loading.set(false);
      });
    }
  }

  getPizzaById(id: number): Pizza | undefined {
    return this.pizzas().find(pizza => pizza.id === id);
  }

  async refreshPizzas(): Promise<void> {
    await this.loadPizzas();
  }
}

