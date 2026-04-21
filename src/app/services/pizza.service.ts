import { Injectable, signal, NgZone, inject } from '@angular/core';
import { Pizza, PIZZAS } from '../data/pizza.data';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.ngZone.run(() => {
        this.pizzas.set(PIZZAS);
        console.log('Loaded pizzas from local data:', PIZZAS.length);
      });
    } catch (err: any) {
      console.error('Error loading pizzas:', err);
      this.ngZone.run(() => {
        this.error.set(err.message || 'Failed to load pizzas');
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

