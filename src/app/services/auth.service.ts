import { Injectable, signal, computed, inject, NgZone } from '@angular/core';

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
  private ngZone = inject(NgZone);
  
  private currentUser = signal<User | null>(null);
  private readonly CURRENT_USER_KEY = 'pizza_palace_current_user';
  private readonly USERS_DB_KEY = 'pizza_palace_users';

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

  private getUsers(): UserDB[] {
    const stored = localStorage.getItem(this.USERS_DB_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  }

  private saveUsers(users: UserDB[]): void {
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
  }

  // Check if email or phone exists
  async checkUserExists(emailOrPhone: string): Promise<boolean> {
    const isEmail = emailOrPhone.includes('@');
    const users = this.getUsers();
    
    const searchVal = isEmail ? emailOrPhone.toLowerCase() : emailOrPhone;
    
    const exists = users.some(u => 
      (isEmail && u.email === searchVal) || 
      (!isEmail && u.phone === searchVal)
    );

    return exists;
  }

  // Sign up new user
  async signUp(name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; message: string }> {
    try {
      const users = this.getUsers();
      const emailLower = email.toLowerCase();
      
      // Check if email already exists
      if (users.some(u => u.email === emailLower)) {
        return { success: false, message: 'An account with this email already exists. Please login.' };
      }

      // Check if phone already exists (if provided)
      let cleanPhone: string | undefined;
      if (phone) {
        cleanPhone = phone.replace(/\D/g, '');
        if (users.some(u => u.phone === cleanPhone)) {
          return { success: false, message: 'An account with this phone number already exists. Please login.' };
        }
      }

      // Create new user
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
      const newUser: UserDB = {
        id: newId,
        name,
        email: emailLower,
        password, // Note: In production, hash this password!
        phone: cleanPhone,
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      this.saveUsers(users);

      // Auto login after signup
      const user: User = {
        id: newUser.id as number,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        created_at: newUser.created_at
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
      const users = this.getUsers();
      
      // Find user by email or phone
      const userDB = users.find(u => 
        (isEmail && u.email === searchValue) || 
        (!isEmail && u.phone === searchValue)
      );

      if (!userDB) {
        const fieldType = isEmail ? 'email' : 'phone number';
        return { success: false, message: `No account found with this ${fieldType}. Please sign up.` };
      }

      // Check password
      if (userDB.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      // Login successful
      const user: User = {
        id: userDB.id as number,
        name: userDB.name,
        email: userDB.email,
        phone: userDB.phone,
        created_at: userDB.created_at
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
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === current.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUserDB = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUserDB;
      this.saveUsers(users);

      const user: User = {
        id: updatedUserDB.id as number,
        name: updatedUserDB.name,
        email: updatedUserDB.email,
        phone: updatedUserDB.phone,
        created_at: updatedUserDB.created_at
      };

      this.setCurrentUser(user);
      return { success: true, message: 'Profile updated successfully!' };
    } catch (err: any) {
      console.error('Update profile error:', err);
      return { success: false, message: err.message || 'Failed to update profile.' };
    }
  }
}

