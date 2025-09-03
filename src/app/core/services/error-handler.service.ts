import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private notifications = signal<Notification[]>([]);

  getNotifications() {
    return this.notifications.asReadonly();
  }

  showError(message: string, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'error',
      message,
      duration,
    });
  }

  showWarning(message: string, duration = 4000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'warning',
      message,
      duration,
    });
  }

  showInfo(message: string, duration = 3000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'info',
      message,
      duration,
    });
  }

  showSuccess(message: string, duration = 3000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'success',
      message,
      duration,
    });
  }

  removeNotification(id: string): void {
    this.notifications.update(notifications => notifications.filter(n => n.id !== id));
  }

  private addNotification(notification: Notification): void {
    this.notifications.update(notifications => [...notifications, notification]);

    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
