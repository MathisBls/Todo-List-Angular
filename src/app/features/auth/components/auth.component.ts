import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly errorHandler = inject(ErrorHandlerService);

  loginForm: FormGroup;
  protected loading = signal(false);
  protected error = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      this.authService
        .login(this.loginForm.value)
        .then(result => {
          this.loading.set(false);
          if (result.success) {
            this.errorHandler.showSuccess('Connexion réussie !');
            // Rediriger vers l'URL de retour ou vers /todos par défaut
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/todos';
            this.router.navigate([returnUrl]);
          } else {
            this.error.set(result.error ?? 'Identifiants invalides');
            this.errorHandler.showError(result.error ?? 'Identifiants invalides');
          }
        })
        .catch(() => {
          this.loading.set(false);
          this.error.set('Une erreur est survenue');
          this.errorHandler.showError('Une erreur est survenue');
        });
    }
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  protected getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return "Format d'email invalide";
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }
}
