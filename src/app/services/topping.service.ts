import { Injectable, inject, signal, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Topping, TOPPINGS, TOPPING_CATEGORIES } from '../data/toppings.data';

@Injectable({
  providedIn: 'root'
})
export class ToppingService {
  private supabaseService = inject(SupabaseService);
  private ngZone = inject(NgZone);
  
  private toppings = signal<Topping[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  // Public readonly signals
  readonly items = this.toppings.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();
  readonly categories = TOPPING_CATEGORIES;

  constructor() {
    this.loadToppings();
  }

  async loadToppings(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.supabaseService.client
        .from('toppings')
        .select('*')
        .order('id');

      if (error) throw error;

      // Run inside NgZone to trigger change detection
      this.ngZone.run(() => {
        if (data && data.length > 0) {
          // Map Supabase data to Topping interface
          const mappedToppings: Topping[] = data.map(item => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            category: item.category || 'veggie',
            isVeg: item.is_vegetarian,
            icon: item.icon || '🍕'
          }));
          console.log('Loaded toppings from Supabase:', mappedToppings.length);
          this.toppings.set(mappedToppings);
        } else {
          // Fallback to local data if Supabase is empty
          console.warn('No toppings found in Supabase, using local data');
          this.toppings.set(TOPPINGS);
        }
      });
    } catch (err: any) {
      console.error('Error loading toppings:', err);
      this.ngZone.run(() => {
        this.error.set(err.message || 'Failed to load toppings');
        // Fallback to local data on error
        this.toppings.set(TOPPINGS);
      });
    } finally {
      this.ngZone.run(() => {
        this.loading.set(false);
      });
    }
  }

  getToppingById(id: number): Topping | undefined {
    return this.toppings().find(topping => topping.id === id);
  }

  getToppingsByCategory(category: string): Topping[] {
    return this.toppings().filter(topping => topping.category === category);
  }

  async refreshToppings(): Promise<void> {
    await this.loadToppings();
  }
}

