import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  // Order confirmation state
  showOrderConfirmation = signal<boolean>(false);
  confirmedOrder = signal<Order | null>(null);
  isProcessingOrder = signal<boolean>(false);

  ngOnInit(): void {
    // Scroll to top when cart page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Also refresh cart data from Supabase
    this.cartService.refreshCart();
  }

  cartItems = computed(() => this.cartService.items());
  totalItems = computed(() => this.cartService.totalItems());
  totalPrice = computed(() => this.cartService.totalPrice());
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  user = computed(() => this.authService.user());

  goBackToMenu(): void {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const menuSection = document.getElementById('menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });
  }

  removeFromCart(itemId: string): void {
    const item = this.cartItems().find(i => i.id === itemId);
    if (item) {
      const toppingInfo = item.toppings.length > 0
        ? ` with ${item.toppings.length} topping${item.toppings.length > 1 ? 's' : ''}`
        : '';
      this.snackbar.warning(`🗑️ ${item.pizza.name}${toppingInfo} removed from cart`);
    }
    this.cartService.removeFromCart(itemId);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems().find(i => i.id === itemId);

    if (quantity <= 0) {
      if (item) {
        const toppingInfo = item.toppings.length > 0
          ? ` with ${item.toppings.length} topping${item.toppings.length > 1 ? 's' : ''}`
          : '';
        this.snackbar.warning(`🗑️ ${item.pizza.name}${toppingInfo} removed from cart`);
      }
      this.cartService.removeFromCart(itemId);
      return;
    }

    const currentQty = item?.quantity || 0;
    if (quantity > currentQty && item) {
      this.snackbar.success(`🍕 Added another ${item.pizza.name}!`);
    }

    this.cartService.updateQuantity(itemId, quantity);
  }

  clearCart(): void {
    const itemCount = this.totalItems();
    this.cartService.clearCart();
    this.snackbar.info(`🧹 Cleared ${itemCount} item${itemCount > 1 ? 's' : ''} from cart`);
  }

  async proceedToCheckout(): Promise<void> {
    // Check if user is logged in
    if (!this.isLoggedIn()) {
      this.snackbar.warning('🔐 Please login to place an order');
      this.router.navigate(['/auth']);
      return;
    }

    const user = this.user();
    if (!user?.email) {
      this.snackbar.error('📧 No email found. Please update your profile.');
      return;
    }

    this.isProcessingOrder.set(true);

    const subtotal = this.totalPrice();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const result = await this.orderService.createOrder(
      this.cartItems(),
      subtotal,
      tax,
      total
    );

    this.isProcessingOrder.set(false);

    if (result.success && result.order) {
      this.confirmedOrder.set(result.order);
      this.showOrderConfirmation.set(true);
      this.cartService.clearCart();
      this.snackbar.success(`🎉 Order confirmed! Confirmation sent to ${user.email}`);
    } else {
      this.snackbar.error(result.error || 'Failed to place order. Please try again.');
    }
  }

  closeOrderConfirmation(): void {
    this.showOrderConfirmation.set(false);
    this.confirmedOrder.set(null);
    this.goBackToMenu();
  }
}
