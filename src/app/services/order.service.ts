import { Injectable, inject, signal, NgZone } from '@angular/core';
import { CartItem } from './cart.service';
import { AuthService } from './auth.service';

export interface OrderItem {
  pizza_name: string;
  pizza_id: number;
  size: string;
  toppings: string[];
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id?: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  private isProcessing = signal<boolean>(false);
  private lastOrder = signal<Order | null>(null);

  readonly processing = this.isProcessing.asReadonly();
  readonly order = this.lastOrder.asReadonly();

  private readonly ORDERS_DB_KEY = 'pizza_palace_orders';

  private getStoredOrders(): Order[] {
    const stored = localStorage.getItem(this.ORDERS_DB_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  }

  private saveStoredOrders(orders: Order[]): void {
    localStorage.setItem(this.ORDERS_DB_KEY, JSON.stringify(orders));
  }

  async createOrder(cartItems: CartItem[], subtotal: number, tax: number, total: number): Promise<{ success: boolean; order?: Order; error?: string }> {
    const user = this.authService.user();

    if (!user) {
      return { success: false, error: 'Please login to place an order' };
    }

    if (!user.email) {
      return { success: false, error: 'No email address found. Please update your profile.' };
    }

    this.isProcessing.set(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Convert cart items to order items
      const orderItems: OrderItem[] = cartItems.map(item => ({
        pizza_name: item.pizza.name,
        pizza_id: item.pizza.id,
        size: item.size.display_name,
        toppings: item.toppings.map(t => t.name),
        quantity: item.quantity,
        unit_price: item.itemPrice,
        total_price: item.itemPrice * item.quantity
      }));

      const allOrders = this.getStoredOrders();
      const newId = allOrders.length > 0 ? Math.max(...allOrders.map(o => o.id || 0)) + 1 : 1;

      // Create order object
      const savedOrder: Order = {
        id: newId,
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        user_phone: user.phone || '',
        items: orderItems,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };

      allOrders.push(savedOrder);
      this.saveStoredOrders(allOrders);

      console.log('Order confirmed locally for:', savedOrder.user_email);

      this.ngZone.run(() => {
        this.lastOrder.set(savedOrder);
        this.isProcessing.set(false);
      });

      return { success: true, order: savedOrder };

    } catch (err: any) {
      console.error('Error creating order:', err);
      this.ngZone.run(() => {
        this.isProcessing.set(false);
      });
      return { success: false, error: err.message || 'Failed to place order' };
    }
  }

  private async sendOrderConfirmationEmail(order: Order): Promise<void> {
    console.log('Dummy email sent to:', order.user_email);
  }

  async getOrderHistory(): Promise<Order[]> {
    const user = this.authService.user();
    if (!user) return [];

    try {
      const allOrders = this.getStoredOrders();
      const userOrders = allOrders
        .filter(o => o.user_id === user.id)
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

      return userOrders;
    } catch (err) {
      console.error('Error fetching order history:', err);
      return [];
    }
  }
}

