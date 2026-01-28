import { Injectable, signal } from '@angular/core';
import { Pizza } from '../data/pizza.data';
import { Topping } from '../data/toppings.data';
import { PizzaSize } from './size.service';

export interface ModalPayload {
  toppings: Topping[];
  size: PizzaSize;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isOpen = signal<boolean>(false);
  private currentPizza = signal<Pizza | null>(null);
  private onAddCallback: ((payload: ModalPayload) => void) | null = null;

  readonly modalOpen = this.isOpen.asReadonly();
  readonly pizza = this.currentPizza.asReadonly();

  openToppingsModal(pizza: Pizza, onAdd: (payload: ModalPayload) => void): void {
    this.currentPizza.set(pizza);
    this.onAddCallback = onAdd;
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isOpen.set(false);
    this.currentPizza.set(null);
    this.onAddCallback = null;
    document.body.style.overflow = '';
  }

  addToCart(payload: ModalPayload): void {
    if (this.onAddCallback) {
      this.onAddCallback(payload);
    }
    this.closeModal();
  }
}

