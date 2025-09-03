import { Injectable, signal } from '@angular/core';

export interface ErrorNotification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errors = signal<ErrorNotification[]>([]);
  public errors$ = this.errors.asReadonly();

  showError(message: string) {
    this.addNotification(message, 'error');
  }

  showWarning(message: string) {
    this.addNotification(message, 'warning');
  }

  showInfo(message: string) {
    this.addNotification(message, 'info');
  }

  private addNotification(message: string, type: 'error' | 'warning' | 'info') {
    const notification: ErrorNotification = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
    };

    this.errors.update(errors => [...errors, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeError(notification.id);
    }, 5000);
  }

  removeError(id: string) {
    // Ajouter une classe pour l'animation de sortie
    const element = document.querySelector(`[data-notification-id="${id}"]`);
    if (element) {
      element.classList.add('removing');
      // Supprimer après l'animation
      setTimeout(() => {
        this.errors.update(errors => errors.filter(error => error.id !== id));
      }, 300);
    } else {
      // Fallback si l'élément n'est pas trouvé
      this.errors.update(errors => errors.filter(error => error.id !== id));
    }
  }

  clearAll() {
    this.errors.set([]);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
