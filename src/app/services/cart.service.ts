import { Injectable, signal, computed, inject, NgZone } from '@angular/core';
import { Pizza } from '../data/pizza.data';
import { Topping } from '../data/toppings.data';
import { SupabaseService } from './supabase.service';
import { PizzaSize } from './size.service';

export interface CartItem {
  id: string; // Unique ID for each cart item (pizza + toppings + size combination)
  pizza: Pizza;
  toppings: Topping[];
  size: PizzaSize;
  quantity: number;
  itemPrice: number; // Base pizza price * size multiplier + toppings
}

// Interface for Supabase cart storage
interface CartItemDB {
  id?: number;
  user_id?: number;       // For logged-in users
  session_id?: string;    // For anonymous users
  item_id: string;
  pizza_id: number;
  pizza_data: Pizza;
  toppings_data: Topping[];
  size_data: PizzaSize;
  quantity: number;
  item_price: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private supabaseService = inject(SupabaseService);
  private ngZone = inject(NgZone);

  private cartItems = signal<CartItem[]>([]);
  private sessionId: string;
  private currentUserId: number | null = null;
  private isLoading = signal<boolean>(false);

  // Computed values
  items = computed(() => this.cartItems());
  loading = computed(() => this.isLoading());

  totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.itemPrice * item.quantity), 0)
  );

  constructor() {
    // Get or create session ID for anonymous cart tracking
    this.sessionId = this.getOrCreateSessionId();
    // Check if user is logged in from localStorage
    this.checkLoggedInUser();
    // Load cart from Supabase on initialization
    this.loadCartFromSupabase();
  }

  private checkLoggedInUser(): void {
    const storedUser = localStorage.getItem('pizza_palace_current_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserId = user.id;
      } catch {
        this.currentUserId = null;
      }
    }
  }

  private getOrCreateSessionId(): string {
    const storageKey = 'pizza_palace_session_id';
    let sessionId = localStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(storageKey, sessionId);
    }

    return sessionId;
  }

  // Set user ID when user logs in
  setUserId(userId: number | null): void {
    this.currentUserId = userId;
    // Reload cart for this user
    this.loadCartFromSupabase();
  }

  // Called when user logs out
  onLogout(): void {
    this.currentUserId = null;
    this.cartItems.set([]);
    // Optionally load anonymous cart
    this.loadCartFromSupabase();
  }

  private generateItemId(pizzaId: number, toppings: Topping[], size: PizzaSize): string {
    const toppingIds = toppings.map(t => t.id).sort().join('-');
    return `${pizzaId}_${size.id}_${toppingIds || 'base'}`;
  }

  private calculateItemPrice(pizza: Pizza, toppings: Topping[], size: PizzaSize): number {
    const toppingsTotal = toppings.reduce((sum, t) => sum + t.price, 0);
    const basePriceWithSize = pizza.price * size.price_multiplier;
    return basePriceWithSize + toppingsTotal;
  }

  // Get the filter for querying cart items
  private getCartFilter() {
    if (this.currentUserId) {
      return { column: 'user_id', value: this.currentUserId };
    }
    return { column: 'session_id', value: this.sessionId };
  }

  // Load cart from Supabase
  async loadCartFromSupabase(): Promise<void> {
    this.isLoading.set(true);

    try {
      const filter = this.getCartFilter();

      const { data, error } = await this.supabaseService.client
        .from('cart_items')
        .select('*')
        .eq(filter.column, filter.value)
        .order('created_at', { ascending: true });

      if (error) throw error;

      this.ngZone.run(() => {
        if (data && data.length > 0) {
          const defaultSize: PizzaSize = { id: 1, name: 'regular', display_name: 'Regular', serves: 'Serves 1', price_multiplier: 1.0, is_default: true, is_active: true, sort_order: 1 };
          const cartItems: CartItem[] = data.map((item: CartItemDB) => ({
            id: item.item_id,
            pizza: item.pizza_data,
            toppings: item.toppings_data || [],
            size: item.size_data || defaultSize,
            quantity: item.quantity,
            itemPrice: item.item_price
          }));
          console.log('Loaded cart from Supabase:', cartItems.length, 'items for',
            this.currentUserId ? `user ${this.currentUserId}` : `session ${this.sessionId}`);
          this.cartItems.set(cartItems);
        } else {
          console.log('No cart items found in Supabase for',
            this.currentUserId ? `user ${this.currentUserId}` : `session ${this.sessionId}`);
          this.cartItems.set([]);
        }
      });
    } catch (err: any) {
      console.error('Error loading cart:', err);
    } finally {
      this.ngZone.run(() => {
        this.isLoading.set(false);
      });
    }
  }

  // Save cart item to Supabase
  private async saveCartItemToSupabase(item: CartItem): Promise<void> {
    try {
      const cartItemDB: Partial<CartItemDB> = {
        item_id: item.id,
        pizza_id: item.pizza.id,
        pizza_data: item.pizza,
        toppings_data: item.toppings,
        size_data: item.size,
        quantity: item.quantity,
        item_price: item.itemPrice
      };

      // Add user_id or session_id based on login status
      if (this.currentUserId) {
        cartItemDB.user_id = this.currentUserId;
        cartItemDB.session_id = undefined;  // Clear session_id for logged-in users
      } else {
        cartItemDB.session_id = this.sessionId;
        cartItemDB.user_id = undefined;
      }

      // Upsert: insert or update if exists
      const { error } = await this.supabaseService.client
        .from('cart_items')
        .upsert(cartItemDB as CartItemDB, {
          onConflict: this.currentUserId ? 'user_id,item_id' : 'session_id,item_id'
        });

      if (error) throw error;
      console.log('Cart item saved to Supabase:', item.id);
    } catch (err: any) {
      console.error('Error saving cart item:', err);
    }
  }

  // Remove cart item from Supabase
  private async removeCartItemFromSupabase(itemId: string): Promise<void> {
    try {
      const filter = this.getCartFilter();

      const { error } = await this.supabaseService.client
        .from('cart_items')
        .delete()
        .eq(filter.column, filter.value)
        .eq('item_id', itemId);

      if (error) throw error;
      console.log('Cart item removed from Supabase:', itemId);
    } catch (err: any) {
      console.error('Error removing cart item:', err);
    }
  }

  // Clear all cart items from Supabase
  private async clearCartFromSupabase(): Promise<void> {
    try {
      const filter = this.getCartFilter();

      const { error } = await this.supabaseService.client
        .from('cart_items')
        .delete()
        .eq(filter.column, filter.value);

      if (error) throw error;
      console.log('Cart cleared from Supabase');
    } catch (err: any) {
      console.error('Error clearing cart:', err);
    }
  }

  addToCart(pizza: Pizza, toppings: Topping[] = [], size?: PizzaSize): void {
    // Default size if not provided
    const defaultSize: PizzaSize = { id: 1, name: 'regular', display_name: 'Regular', serves: 'Serves 1', price_multiplier: 1.0, is_default: true, is_active: true, sort_order: 1 };
    const selectedSize = size || defaultSize;

    const itemId = this.generateItemId(pizza.id, toppings, selectedSize);
    const itemPrice = this.calculateItemPrice(pizza, toppings, selectedSize);

    let newItem: CartItem | null = null;

    this.cartItems.update(items => {
      const existingItem = items.find(item => item.id === itemId);

      if (existingItem) {
        const updatedItems = items.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        newItem = updatedItems.find(item => item.id === itemId)!;
        return updatedItems;
      }

      newItem = {
        id: itemId,
        pizza,
        toppings: [...toppings],
        size: selectedSize,
        quantity: 1,
        itemPrice
      };
      return [...items, newItem];
    });

    // Save to Supabase
    if (newItem) {
      this.saveCartItemToSupabase(newItem);
    }
  }

  removeFromCart(itemId: string): void {
    this.cartItems.update(items =>
      items.filter(item => item.id !== itemId)
    );
    // Remove from Supabase
    this.removeCartItemFromSupabase(itemId);
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    let updatedItem: CartItem | null = null;

    this.cartItems.update(items =>
      items.map(item => {
        if (item.id === itemId) {
          updatedItem = { ...item, quantity };
          return updatedItem;
        }
        return item;
      })
    );

    // Update in Supabase
    if (updatedItem) {
      this.saveCartItemToSupabase(updatedItem);
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
    // Clear from Supabase
    this.clearCartFromSupabase();
  }

  getItemQuantity(pizzaId: number): number {
    // Get total quantity of all items with this pizza (regardless of toppings)
    return this.cartItems()
      .filter(item => item.pizza.id === pizzaId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  getItemsByPizzaId(pizzaId: number): CartItem[] {
    return this.cartItems().filter(item => item.pizza.id === pizzaId);
  }

  // Refresh cart from Supabase (useful when navigating to cart page)
  async refreshCart(): Promise<void> {
    await this.loadCartFromSupabase();
  }
}
