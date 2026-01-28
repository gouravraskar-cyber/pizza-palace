import { Injectable, signal } from '@angular/core';

export interface SnackbarMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private messageId = 0;
  messages = signal<SnackbarMessage[]>([]);

  show(message: string, type: SnackbarMessage['type'] = 'success', duration = 3000): void {
    const id = ++this.messageId;
    
    const newMessage: SnackbarMessage = {
      id,
      message,
      type,
      icon: this.getIcon(type)
    };

    this.messages.update(msgs => [...msgs, newMessage]);

    // Auto remove after duration
    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  dismiss(id: number): void {
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
  }

  private getIcon(type: SnackbarMessage['type']): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  // Convenience methods
  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 3000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 3000): void {
    this.show(message, 'warning', duration);
  }
}

