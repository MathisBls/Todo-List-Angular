import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected error = signal<string | null>(null);
  protected loading = signal(false);

  protected onLogin(): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService
      .login({
        email: this.email,
        password: this.password,
      })
      .then(result => {
        this.loading.set(false);

        if (result.success) {
          this.router.navigate(['/todos']);
        } else {
          this.error.set(result.error ?? 'Identifiants invalides');
        }
      })
      .catch(() => {
        this.loading.set(false);
        this.error.set('Une erreur est survenue');
      });
  }
}
