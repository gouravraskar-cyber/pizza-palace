import { Component, Input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pizza } from '../../data/pizza.data';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SizeService } from '../../services/size.service';
import { ModalService, ModalPayload } from '../../services/modal.service';

@Component({
  selector: 'app-pizza-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pizza-card.component.html',
  styleUrl: './pizza-card.component.scss'
})
export class PizzaCardComponent {
  @Input({ required: true }) pizza!: Pizza;
  
  private cartService = inject(CartService);
  private snackbar = inject(SnackbarService);
  private sizeService = inject(SizeService);
  private modalService = inject(ModalService);
  
  isAdding = signal(false);
  justAdded = signal(false);

  quantity = computed(() => this.cartService.getItemQuantity(this.pizza.id));
  isInCart = computed(() => this.quantity() > 0);
  cartItems = computed(() => this.cartService.getItemsByPizzaId(this.pizza.id));

  openToppingsModal(): void {
    this.modalService.openToppingsModal(this.pizza, (payload: ModalPayload) => {
      this.addToCartWithToppings(payload);
    });
  }

  addToCartWithToppings(payload: ModalPayload): void {
    this.isAdding.set(true);
    this.cartService.addToCart(this.pizza, payload.toppings, payload.size);
    
    // Show snackbar with topping and size info
    const toppingCount = payload.toppings.length;
    const sizeName = payload.size.display_name;
    let message = `🍕 ${this.pizza.name} (${sizeName})`;
    if (toppingCount > 0) {
      message += ` with ${toppingCount} topping${toppingCount > 1 ? 's' : ''}`;
    }
    message += ' added!';
    this.snackbar.success(message);
    
    // Show success feedback
    this.justAdded.set(true);
    
    setTimeout(() => {
      this.isAdding.set(false);
    }, 300);

    setTimeout(() => {
      this.justAdded.set(false);
    }, 2000);
  }

  quickAdd(): void {
    // Quick add without toppings (for increment) - uses default size
    const defaultSize = this.sizeService.getDefaultSize();
    this.cartService.addToCart(this.pizza, [], defaultSize);
    this.snackbar.success(`🍕 Added another ${this.pizza.name}!`);
  }

  decrementQuantity(event: Event): void {
    event.stopPropagation();
    const items = this.cartItems();
    
    if (items.length > 0) {
      // Remove from the first item found
      const firstItem = items[0];
      if (firstItem.quantity === 1) {
        this.snackbar.warning(`🗑️ ${this.pizza.name} removed from cart`);
        this.cartService.removeFromCart(firstItem.id);
      } else {
        this.cartService.updateQuantity(firstItem.id, firstItem.quantity - 1);
      }
    }
  }

  incrementQuantity(event: Event): void {
    event.stopPropagation();
    this.openToppingsModal();
  }
}
