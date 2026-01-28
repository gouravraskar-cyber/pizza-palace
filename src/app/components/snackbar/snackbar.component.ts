import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar-container">
      @for (msg of snackbarService.messages(); track msg.id) {
        <div 
          class="snackbar" 
          [class]="'snackbar--' + msg.type"
          (click)="snackbarService.dismiss(msg.id)"
        >
          <span class="snackbar__icon">{{ msg.icon }}</span>
          <span class="snackbar__message">{{ msg.message }}</span>
          <button class="snackbar__close" aria-label="Dismiss">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(100%) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(100%) scale(0.9);
      }
    }

    .snackbar-container {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: calc(100% - 2rem);
      max-width: 400px;
      pointer-events: none;

      @media (min-width: 640px) {
        bottom: 2rem;
        left: auto;
        right: 2rem;
        transform: none;
      }
    }

    .snackbar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: #2A2A2A;
      border-radius: 0.75rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      cursor: pointer;
      pointer-events: auto;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: scale(1.02);
        box-shadow: 0 12px 45px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
      }

      &:active {
        transform: scale(0.98);
      }

      &--success {
        border-left: 4px solid #4CAF50;

        .snackbar__icon {
          color: #4CAF50;
          background: rgba(76, 175, 80, 0.15);
        }
      }

      &--error {
        border-left: 4px solid #E63946;

        .snackbar__icon {
          color: #E63946;
          background: rgba(230, 57, 70, 0.15);
        }
      }

      &--warning {
        border-left: 4px solid #F4A261;

        .snackbar__icon {
          color: #F4A261;
          background: rgba(244, 162, 97, 0.15);
        }
      }

      &--info {
        border-left: 4px solid #3B82F6;

        .snackbar__icon {
          color: #3B82F6;
          background: rgba(59, 130, 246, 0.15);
        }
      }
    }

    .snackbar__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      font-size: 0.875rem;
      font-weight: 700;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .snackbar__message {
      flex: 1;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #FDFCDC;
      line-height: 1.4;
    }

    .snackbar__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: #B5B5B5;
      transition: all 0.2s ease;
      flex-shrink: 0;

      svg {
        width: 14px;
        height: 14px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #FDFCDC;
      }
    }
  `]
})
export class SnackbarComponent {
  snackbarService = inject(SnackbarService);
}

