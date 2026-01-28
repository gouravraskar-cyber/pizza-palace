import { Injectable, inject, signal, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';
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
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);

  private isProcessing = signal<boolean>(false);
  private lastOrder = signal<Order | null>(null);

  readonly processing = this.isProcessing.asReadonly();
  readonly order = this.lastOrder.asReadonly();

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

      // Create order object
      const orderData: Partial<Order> = {
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        user_phone: user.phone || '',
        items: orderItems,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'confirmed'
      };

      // Save order to Supabase
      const { data, error } = await this.supabaseService.client
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      const savedOrder = data as Order;

      // Email sending disabled for now - requires:
      // 1. Verified domain in Resend
      // 2. Supabase Edge Function deployed
      // For demo purposes, order confirmation is shown in the UI instead
      console.log('Order confirmed for:', savedOrder.user_email);

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
    try {
      // Call Supabase Edge Function to send email
      const { error } = await this.supabaseService.client.functions.invoke('send-order-email', {
        body: {
          to: order.user_email,
          userName: order.user_name,
          orderId: order.id,
          items: order.items,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total
        }
      });

      if (error) {
        console.warn('Email sending failed (Edge Function may not be set up):', error);
        // Don't throw - order was still created successfully
      } else {
        console.log('Order confirmation email sent to:', order.user_email);
      }
    } catch (err) {
      console.warn('Email service not available:', err);
      // Don't throw - order was still created successfully
    }
  }

  async getOrderHistory(): Promise<Order[]> {
    const user = this.authService.user();
    if (!user) return [];

    try {
      const { data, error } = await this.supabaseService.client
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    } catch (err) {
      console.error('Error fetching order history:', err);
      return [];
    }
  }
}

