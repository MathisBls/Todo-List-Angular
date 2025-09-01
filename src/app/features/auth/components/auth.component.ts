import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected email = signal('');
  protected password = signal('');
  protected error = signal<string | null>(null);
  protected loading = signal(false);

  public onEmailChange(value: string): void {
    this.email.set(value);
  }

  public onPasswordChange(value: string): void {
    this.password.set(value);
  }

  public onLogin(): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService
      .login({
        email: this.email(),
        password: this.password(),
      })
      .then(result => {
        this.loading.set(false);

        if (result.success) {
          this.router.navigate(['/admin']);
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
