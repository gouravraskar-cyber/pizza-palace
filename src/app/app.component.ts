import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { ToppingsModalComponent } from './components/toppings-modal/toppings-modal.component';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SnackbarComponent, ToppingsModalComponent],
  template: `
    @if (!isAuthPage()) {
      <app-header />
    }
    <main class="main-content">
      <router-outlet />
    </main>
    @if (!isAuthPage()) {
      <app-footer />
    }
    <app-snackbar />
    
    <!-- Global Toppings Modal -->
    @if (modalService.pizza()) {
      <app-toppings-modal 
        [pizza]="modalService.pizza()!" 
        [isOpen]="modalService.modalOpen()"
        (close)="modalService.closeModal()"
        (addToCart)="modalService.addToCart($event)"
      />
    }
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
    }
  `]
})
export class AppComponent {
  private router = inject(Router);
  modalService = inject(ModalService);
  title = 'Pizza Palace';

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  isAuthPage = computed(() => this.currentUrl()?.startsWith('/auth') ?? false);
}
