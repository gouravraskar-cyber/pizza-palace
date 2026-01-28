import { Injectable, inject, signal, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface PizzaSize {
  id: number;
  name: string;
  display_name: string;
  serves: string;
  price_multiplier: number;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
}

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private supabaseService = inject(SupabaseService);
  private ngZone = inject(NgZone);

  private sizes = signal<PizzaSize[]>([]);
  private loading = signal<boolean>(false);

  readonly items = this.sizes.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  // Default sizes as fallback
  private defaultSizes: PizzaSize[] = [
    { id: 1, name: 'regular', display_name: 'Regular', serves: 'Serves 1', price_multiplier: 1.0, is_default: true, is_active: true, sort_order: 1 },
    { id: 2, name: 'medium', display_name: 'Medium', serves: 'Serves 2', price_multiplier: 1.5, is_default: false, is_active: true, sort_order: 2 },
    { id: 3, name: 'large', display_name: 'Large', serves: 'Serves 4', price_multiplier: 2.0, is_default: false, is_active: true, sort_order: 3 }
  ];

  constructor() {
    this.loadSizes();
  }

  async loadSizes(): Promise<void> {
    this.loading.set(true);

    try {
      const { data, error } = await this.supabaseService.client
        .from('pizza_sizes')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      this.ngZone.run(() => {
        if (data && data.length > 0) {
          this.sizes.set(data);
          console.log('Loaded pizza sizes from Supabase:', data.length);
        } else {
          console.warn('No sizes found in Supabase, using defaults');
          this.sizes.set(this.defaultSizes);
        }
      });
    } catch (err: any) {
      console.error('Error loading pizza sizes:', err);
      this.ngZone.run(() => {
        this.sizes.set(this.defaultSizes);
      });
    } finally {
      this.ngZone.run(() => {
        this.loading.set(false);
      });
    }
  }

  getDefaultSize(): PizzaSize {
    const sizes = this.sizes();
    return sizes.find(s => s.is_default) || sizes[0] || this.defaultSizes[0];
  }

  getSizeById(id: number): PizzaSize | undefined {
    return this.sizes().find(s => s.id === id);
  }

  calculatePriceWithSize(basePrice: number, size: PizzaSize): number {
    return basePrice * size.price_multiplier;
  }
}

