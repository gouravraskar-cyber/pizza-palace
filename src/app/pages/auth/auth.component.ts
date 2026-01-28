import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private sliderInterval: ReturnType<typeof setInterval> | null = null;

  isLoginMode = signal(true);
  isLoading = signal(false);
  showPassword = signal(false);
  currentSlide = signal(0);

  // Background slider images
  sliderImages = [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&q=80',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1920&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&q=80',
    'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=1920&q=80',
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1920&q=80',
    'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1920&q=80'
  ];

  // Form fields
  name = '';
  emailOrPhone = '';  // For login - can be email or phone
  email = '';         // For signup
  password = '';
  confirmPassword = '';
  phone = '';

  // Validation errors
  errors = signal<{ [key: string]: string }>({});

  ngOnInit(): void {
    this.startSlider();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  private startSlider(): void {
    this.sliderInterval = setInterval(() => {
      this.currentSlide.update(current => 
        (current + 1) % this.sliderImages.length
      );
    }, 5000); // Change image every 5 seconds
  }

  private stopSlider(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
      this.sliderInterval = null;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    // Reset timer when manually changing slides
    this.stopSlider();
    this.startSlider();
  }

  toggleMode(): void {
    this.isLoginMode.update(v => !v);
    this.clearForm();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  clearForm(): void {
    this.name = '';
    this.emailOrPhone = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.phone = '';
    this.errors.set({});
  }

  validateForm(): boolean {
    const newErrors: { [key: string]: string } = {};

    if (this.isLoginMode()) {
      // Login validation - email OR phone
      if (!this.emailOrPhone) {
        newErrors['emailOrPhone'] = 'Email or phone number is required';
      } else {
        const isEmail = this.emailOrPhone.includes('@');
        const isPhone = /^[0-9]{10}$/.test(this.emailOrPhone.replace(/\D/g, ''));
        
        if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailOrPhone)) {
          newErrors['emailOrPhone'] = 'Please enter a valid email';
        } else if (!isEmail && !isPhone) {
          newErrors['emailOrPhone'] = 'Please enter a valid email or 10-digit phone number';
        }
      }
    } else {
      // Signup validation - email is required
      if (!this.email) {
        newErrors['email'] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        newErrors['email'] = 'Please enter a valid email';
      }

      if (!this.name) {
        newErrors['name'] = 'Name is required';
      } else if (this.name.length < 2) {
        newErrors['name'] = 'Name must be at least 2 characters';
      }

      if (this.password !== this.confirmPassword) {
        newErrors['confirmPassword'] = 'Passwords do not match';
      }

      if (this.phone && !/^[0-9]{10}$/.test(this.phone.replace(/\D/g, ''))) {
        newErrors['phone'] = 'Please enter a valid 10-digit phone number';
      }
    }

    // Password validation for both modes
    if (!this.password) {
      newErrors['password'] = 'Password is required';
    } else if (this.password.length < 6) {
      newErrors['password'] = 'Password must be at least 6 characters';
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) return;

    this.isLoading.set(true);

    try {
      if (this.isLoginMode()) {
        await this.handleLogin();
      } else {
        await this.handleSignUp();
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  private async handleLogin(): Promise<void> {
    const result = await this.authService.login(this.emailOrPhone, this.password);
    
    if (result.success) {
      // Load user-specific cart
      const user = this.authService.user();
      if (user) {
        this.cartService.setUserId(user.id);
      }
      
      this.snackbar.success(`🎉 ${result.message}`);
      this.router.navigate(['/']);
    } else {
      this.snackbar.error(`❌ ${result.message}`);
      
      // If no account exists, suggest sign up
      if (result.message.includes('No account')) {
        this.errors.set({ emailOrPhone: 'No account found. Click "Sign Up" to create one.' });
      }
    }
  }

  private async handleSignUp(): Promise<void> {
    const result = await this.authService.signUp(this.name, this.email, this.password, this.phone || undefined);
    
    if (result.success) {
      // Load user-specific cart (will be empty for new user)
      const user = this.authService.user();
      if (user) {
        this.cartService.setUserId(user.id);
      }
      
      this.snackbar.success(`🎉 ${result.message}`);
      this.router.navigate(['/']);
    } else {
      this.snackbar.error(`❌ ${result.message}`);
      
      // If account exists, suggest login
      if (result.message.includes('already exists')) {
        this.errors.set({ email: 'Account exists. Click "Login" to sign in.' });
      }
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
