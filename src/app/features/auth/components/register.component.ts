import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService
      .register({
        email: this.email(),
        password: this.password(),
        confirmPassword: this.confirmPassword(),
      })
      .then(result => {
        this.loading.set(false);

        if (result.success) {
          this.router.navigate(['/todos']);
        } else {
          this.error.set(result.error || 'Erreur lors de la création du compte');
        }
      })
      .catch(() => {
        this.loading.set(false);
        this.error.set('Une erreur est survenue');
      });
  }
}
