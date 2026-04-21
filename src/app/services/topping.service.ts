import { Injectable, signal, NgZone, inject } from '@angular/core';
import { Topping, TOPPINGS, TOPPING_CATEGORIES } from '../data/toppings.data';

@Injectable({
  providedIn: 'root'
})
export class ToppingService {
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.ngZone.run(() => {
        this.toppings.set(TOPPINGS);
        console.log('Loaded toppings from local data:', TOPPINGS.length);
      });
    } catch (err: any) {
      console.error('Error loading toppings:', err);
      this.ngZone.run(() => {
        this.error.set(err.message || 'Failed to load toppings');
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

