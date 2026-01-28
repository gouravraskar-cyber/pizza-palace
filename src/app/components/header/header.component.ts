import { Component, HostListener, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);

  cartTotal = computed(() => this.cartService.totalItems());
  user = computed(() => this.authService.user());
  isLoggedIn = computed(() => this.authService.isLoggedIn());

  navLinks = [
    { label: 'Home', path: '/', fragment: '' },
    { label: 'Menu', path: '/', fragment: 'menu' },
    { label: 'About', path: '/', fragment: 'about' }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.header__user-menu') && !target.closest('.header__user-btn')) {
      this.isUserMenuOpen.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
    this.isUserMenuOpen.set(false);

    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  goToCart(): void {
    this.closeMobileMenu();
    this.router.navigate(['/cart']);
  }

  goToAuth(): void {
    this.closeMobileMenu();
    this.router.navigate(['/auth']);
  }

  logout(): void {
    this.authService.logout();
    this.cartService.onLogout();  // Clear user-specific cart
    this.isUserMenuOpen.set(false);
    this.closeMobileMenu();
    this.snackbar.info('👋 You have been logged out');
    this.router.navigate(['/auth']);
  }

  scrollToSection(fragment: string, event?: Event): void {
    // Prevent default anchor behavior
    if (event) {
      event.preventDefault();
    }

    this.closeMobileMenu();

    if (fragment) {
      // If not on home page, navigate first then scroll
      if (this.router.url !== '/') {
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.scrollToElement(fragment);
          }, 300);  // Increased timeout for page load
        });
      } else {
        this.scrollToElement(fragment);
      }
    } else {
      // Home link - go to top
      if (this.router.url !== '/') {
        this.router.navigate(['/']);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  private scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth'
      });
    }
  }

  getUserInitials(): string {
    const name = this.user()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
