import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

// Validateur personnalisé pour la confirmation de mot de passe
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value && confirmPassword.value) {
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly errorHandler = inject(ErrorHandlerService);

  registerForm: FormGroup;
  protected loading = signal(false);
  protected error = signal<string>('');

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  protected onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set('');

      // Envoyer tous les champs au service (y compris confirmPassword)
      const userData = this.registerForm.value;

      this.authService
        .register(userData)
        .then(result => {
          this.loading.set(false);
          if (result.success) {
            this.errorHandler.showSuccess('Compte créé avec succès !');
            this.router.navigate(['/todos']);
          } else {
            this.error.set(result.error ?? 'Erreur lors de la création du compte');
            this.errorHandler.showError(result.error ?? 'Erreur lors de la création du compte');
          }
        })
        .catch(() => {
          this.loading.set(false);
          this.error.set('Une erreur est survenue');
          this.errorHandler.showError('Une erreur est survenue');
        });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return "Format d'email invalide";
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }

  protected passwordsDoNotMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword;
  }
}
