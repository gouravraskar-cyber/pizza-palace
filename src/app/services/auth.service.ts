import { Injectable, signal, computed, inject, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
}

interface UserDB {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private ngZone = inject(NgZone);
  
  private currentUser = signal<User | null>(null);
  private readonly CURRENT_USER_KEY = 'pizza_palace_current_user';

  user = computed(() => this.currentUser());
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.currentUser.set(user);
      } catch {
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    }
  }

  private setCurrentUser(user: User): void {
    this.ngZone.run(() => {
      this.currentUser.set(user);
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    });
  }

  // Check if email or phone exists
  async checkUserExists(emailOrPhone: string): Promise<boolean> {
    const isEmail = emailOrPhone.includes('@');
    
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('id')
      .or(isEmail 
        ? `email.eq.${emailOrPhone.toLowerCase()}`
        : `phone.eq.${emailOrPhone}`
      )
      .limit(1);

    return !error && data && data.length > 0;
  }

  // Sign up new user
  async signUp(name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if email already exists
      const { data: existingEmail } = await this.supabaseService.client
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .limit(1);

      if (existingEmail && existingEmail.length > 0) {
        return { success: false, message: 'An account with this email already exists. Please login.' };
      }

      // Check if phone already exists (if provided)
      if (phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        const { data: existingPhone } = await this.supabaseService.client
          .from('users')
          .select('id')
          .eq('phone', cleanPhone)
          .limit(1);

        if (existingPhone && existingPhone.length > 0) {
          return { success: false, message: 'An account with this phone number already exists. Please login.' };
        }
      }

      // Create new user
      const newUser: UserDB = {
        name,
        email: email.toLowerCase(),
        password, // Note: In production, hash this password!
        phone: phone ? phone.replace(/\D/g, '') : undefined
      };

      const { data, error } = await this.supabaseService.client
        .from('users')
        .insert(newUser)
        .select('id, name, email, phone, created_at')
        .single();

      if (error) throw error;

      // Auto login after signup
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        created_at: data.created_at
      };

      this.setCurrentUser(user);
      console.log('User signed up:', user);

      return { success: true, message: 'Account created successfully!' };
    } catch (err: any) {
      console.error('Signup error:', err);
      return { success: false, message: err.message || 'Failed to create account. Please try again.' };
    }
  }

  // Login with email OR phone number
  async login(emailOrPhone: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const isEmail = emailOrPhone.includes('@');
      const searchValue = isEmail ? emailOrPhone.toLowerCase() : emailOrPhone.replace(/\D/g, '');
      
      // Find user by email or phone
      const { data, error } = await this.supabaseService.client
        .from('users')
        .select('*')
        .or(isEmail 
          ? `email.eq.${searchValue}`
          : `phone.eq.${searchValue}`
        )
        .limit(1)
        .single();

      if (error || !data) {
        const fieldType = isEmail ? 'email' : 'phone number';
        return { success: false, message: `No account found with this ${fieldType}. Please sign up.` };
      }

      // Check password
      if (data.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      // Login successful
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        created_at: data.created_at
      };

      this.setCurrentUser(user);
      console.log('User logged in:', user);

      return { success: true, message: `Welcome back, ${user.name}!` };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  logout(): void {
    this.ngZone.run(() => {
      this.currentUser.set(null);
      localStorage.removeItem(this.CURRENT_USER_KEY);
    });
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; message: string }> {
    const current = this.currentUser();
    if (!current) {
      return { success: false, message: 'Not logged in' };
    }

    try {
      const { data, error } = await this.supabaseService.client
        .from('users')
        .update(updates)
        .eq('id', current.id)
        .select('id, name, email, phone, created_at')
        .single();

      if (error) throw error;

      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        created_at: data.created_at
      };

      this.setCurrentUser(user);
      return { success: true, message: 'Profile updated successfully!' };
    } catch (err: any) {
      console.error('Update profile error:', err);
      return { success: false, message: err.message || 'Failed to update profile.' };
    }
  }
}

