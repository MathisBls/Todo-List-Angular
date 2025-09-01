# Partie 2 : Authentification et Formulaires Réactifs

## 🎯 Objectifs de la Partie 2

À la fin de cette partie, vous serez capable de :
- ✅ Créer des formulaires réactifs avec validation
- ✅ Implémenter l'authentification complète (login/register)
- ✅ Utiliser les Guards pour protéger les routes
- ✅ Maîtriser le lazy loading des modules
- ✅ Gérer les intercepteurs HTTP
- ✅ Créer une interface admin fonctionnelle

---

## 🔐 Étape 2.1 : Formulaires Réactifs

### **✅ Étape 2.1 : Formulaires Réactifs - TERMINÉE**

**Implémentation :**
- ✅ Composant Login avec ReactiveFormsModule
- ✅ Composant Register avec validation avancée
- ✅ Validateur personnalisé passwordMatchValidator
- ✅ Gestion des erreurs en temps réel
- ✅ Navigation entre Login et Register

---

## 🛡️ Étape 2.2 : Guards de Protection

### **✅ Étape 2.2 : Guards de Protection - TERMINÉE**

**Implémentation :**
- ✅ AuthGuard pour protéger les routes authentifiées
- ✅ AdminGuard pour protéger les routes admin
- ✅ Redirection automatique vers login si non authentifié
- ✅ Gestion du returnUrl pour la redirection post-login

---

## 🔄 Étape 2.3 : Lazy Loading Avancé

### **✅ Étape 2.3 : Lazy Loading Avancé - TERMINÉE**

**Implémentation :**
- ✅ Lazy loading déjà configuré dans les routes
- ✅ Composant Register avec validation avancée
- ✅ Navigation croisée entre Login et Register
- ✅ Chargement à la demande des modules

---

## 👑 Étape 2.4 : Interface Admin

### **✅ Étape 2.4 : Interface Admin - TERMINÉE**

**Implémentation :**
- ✅ Tableau de bord avec statistiques en temps réel
- ✅ Gestion avancée des utilisateurs (changement de rôle)
- ✅ Gestion avancée des tickets (statut, priorité, attribution)
- ✅ Interface avec onglets (utilisateurs/tickets)
- ✅ Protection contre auto-suppression et auto-changement de rôle

---

## 🌐 Étape 2.5 : Intercepteurs HTTP

### **✅ Étape 2.5 : Intercepteurs HTTP - TERMINÉE**

**Implémentation :**
- ✅ Intercepteur d'authentification (ajout automatique des tokens)
- ✅ Intercepteur de loading (gestion des requêtes actives)
- ✅ Service ErrorService pour la gestion centralisée des erreurs
- ✅ Composant NotificationsComponent pour les toast notifications
- ✅ Gestion automatique des erreurs 401/403/500
- ✅ Notifications avec auto-suppression et design responsive

**Fonctionnalités :**
- 🔐 **Authentification automatique** : Ajout du token JWT aux headers
- ⏱️ **Loading states** : Compteur de requêtes actives
- 🔔 **Notifications toast** : Error, warning, info avec design adaptatif
- 🛡️ **Gestion d'erreurs** : Centralisée avec ErrorService
- 📊 **Logging** : Traçage des requêtes avec durée

---

## 🎯 Étape 2.6 : Validation Avancée

### **✅ Étape 2.6 : Validation Avancée - TERMINÉE**

**Implémentation :**
- ✅ Validateur personnalisé passwordMatchValidator
- ✅ Validation en temps réel avec messages d'erreur
- ✅ Gestion des erreurs de validation dans les formulaires
- ✅ Validation croisée (mot de passe et confirmation)
- ✅ Messages d'erreur contextuels et informatifs

---

### **Pourquoi les Formulaires Réactifs ?**

Les formulaires réactifs d'Angular offrent plusieurs avantages par rapport aux formulaires template-driven :

#### **🔄 Réactivité et Performance**
- **Signals intégrés** : Les formulaires réactifs utilisent les Signals d'Angular 20+ pour une réactivité optimale
- **Détection de changements efficace** : Seuls les champs modifiés déclenchent des mises à jour
- **Moins de cycles de détection** : Performance améliorée pour les formulaires complexes

#### **🧪 Testabilité**
- **Logique métier séparée** : La logique du formulaire est dans le composant, pas dans le template
- **Tests unitaires facilités** : Possibilité de tester la logique sans DOM
- **Validation centralisée** : Plus facile à tester et maintenir

#### **🎛️ Contrôle granulaire**
- **Validation en temps réel** : Validation dynamique selon l'état des autres champs
- **Transformations de données** : Possibilité de transformer les valeurs avant affichage
- **Gestion d'état avancée** : Contrôle précis de l'état du formulaire

### **Installation des modules requis**

```bash
# Les modules sont déjà inclus dans Angular 20+ par défaut
# ReactiveFormsModule est disponible dans @angular/forms
```

### **Création du composant de login**

```bash
# Créer le composant de login
ng generate component features/auth/components/login
```

### **Création du service AuthService**

```bash
# Créer le service d'authentification
ng generate service features/auth/services/auth
```

### **Mise à jour des modèles utilisateur**

```typescript
// src/app/features/auth/models/user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### **Implémentation du service AuthService**

```typescript
// src/app/features/auth/services/auth.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // Mock data - utilisateurs de test
  private users: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      role: 'user'
    }
  ];

  // Mock data - mots de passe (en réalité, ils seraient hashés)
  private passwords: { [key: string]: string } = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123'
  };

  constructor() {
    // Vérifier s'il y a un utilisateur en session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      // Simuler un délai réseau
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    // Vérifier si l'email existe déjà
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user'
    };

    // Ajouter aux mock data
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    // Simuler un délai réseau
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  // Méthode pour définir l'utilisateur connecté (utilisée après login)
  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
```

### **Implémentation du formulaire de login**
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('email') }}
              </p>
            }
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('password') }}
              </p>
            }
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || loading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              @if (loading()) {
                <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Connexion en cours...
              } @else {
                Se connecter
              }
            </button>
          </div>

          <!-- Error Message -->
          @if (error()) {
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-sm text-red-600">{{ error() }}</p>
            </div>
          }
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string>('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.loading.set(false);
          this.router.navigate(['/todos']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.message || 'Erreur de connexion');
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return 'Format d\'email invalide';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }
}

### **Mise à jour du header avec gestion d'authentification**

```typescript
// src/app/shared/components/header/header.component.ts
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth';
import { User } from '../../../features/auth/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">TodoList App</h1>
        <nav>
          <ul class="flex space-x-4">
            @if (currentUser()) {
              <li><a routerLink="/todos" class="hover:text-blue-200">Todos</a></li>
              @if (currentUser()?.role === 'admin') {
                <li><a routerLink="/admin" class="hover:text-blue-200">Admin</a></li>
              }
              <li><button (click)="logout()" class="hover:text-blue-200">Logout</button></li>
            } @else {
              <li><a routerLink="/auth/login" class="hover:text-blue-200">Login</a></li>
              <li><a routerLink="/auth/register" class="hover:text-blue-200">Register</a></li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser = this.authService.currentUser$;

  constructor() {
    // Utiliser directement le signal du service
    this.currentUser = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
```

### **Mise à jour des routes d'authentification**

```typescript
// src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    // TODO: Ajouter RegisterComponent dans la Partie 2
    redirectTo: '/todos',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
```

---

## 🧪 Test fonctionnel - Étape 2.1 : Formulaires Réactifs

### **Vérifications à effectuer :**

#### **1. Test du formulaire de login**
```bash
# Lancer l'application
ng serve

# Aller sur http://localhost:4200/auth/login
```

**✅ Tests à réaliser :**
- [ ] Le formulaire s'affiche correctement
- [ ] Les champs email et password sont présents
- [ ] Le bouton "Se connecter" est désactivé si le formulaire est invalide
- [ ] La validation email fonctionne (format invalide → erreur)
- [ ] La validation password fonctionne (moins de 6 caractères → erreur)
- [ ] Le bouton se connecte avec les identifiants : `admin@example.com` / `admin123`
- [ ] Après connexion, redirection vers `/todos`

#### **2. Test de la validation en temps réel**
- [ ] Taper un email invalide → message d'erreur apparaît
- [ ] Taper un mot de passe court → message d'erreur apparaît
- [ ] Corriger les erreurs → messages disparaissent
- [ ] Le bouton s'active quand le formulaire est valide

#### **3. Test des erreurs de connexion**
- [ ] Essayer de se connecter avec des identifiants invalides
- [ ] Vérifier que le message d'erreur s'affiche
- [ ] Vérifier que le bouton de chargement fonctionne

**🔧 Debug en cas de problème :**
```bash
# Vérifier les erreurs dans la console
F12 → Console

# Vérifier que le composant est bien créé
ng generate component features/auth/components/login --dry-run
```
```

### **🔧 Corrections importantes apportées**

#### **Types et interfaces**
- **User interface** : Ajout de la propriété `name` manquante
- **RegisterRequest** : Ajout de la propriété `name` pour l'inscription
- **Passwords object** : Typage correct avec `{ [key: string]: string }`

#### **Signals vs Observables**
- **Header component** : Utilisation directe du signal `currentUser$` du service
- **Pas de subscribe** : Les signals n'utilisent pas `.subscribe()` comme les Observables

#### **Gestion d'état**
- **localStorage** : Persistance de session avec sauvegarde/restauration automatique
- **Navigation dynamique** : Header adaptatif selon l'état de connexion

### **Explication technique : FormBuilder et FormGroup**
- **Pattern Builder** : Simplifie la création de formulaires complexes
- **Type Safety** : TypeScript peut inférer les types des contrôles
- **Réactivité** : Intégration native avec les Signals d'Angular 20+

#### **📋 FormGroup**
- **Conteneur de contrôles** : Gère un ensemble de FormControl
- **Validation globale** : Peut valider l'ensemble du formulaire
- **État réactif** : Émet des événements lors des changements

#### **🎛️ FormControl**
- **Contrôle individuel** : Gère un champ de formulaire
- **Validation locale** : Validators appliqués au niveau du champ
- **État en temps réel** : dirty, touched, valid, etc.

---

## 🛡️ Étape 2.2 : Guards de Protection

### **Pourquoi les Guards ?**

Les Guards permettent de contrôler l'accès aux routes selon des conditions métier :

#### **🔒 Sécurité**
- **Protection des routes** : Empêcher l'accès non autorisé
- **Redirection automatique** : Rediriger vers login si non authentifié
- **Validation des permissions** : Vérifier les rôles utilisateur

#### **🎯 Expérience utilisateur**
- **Navigation fluide** : Redirection automatique sans erreur 404
- **Feedback immédiat** : L'utilisateur sait pourquoi il ne peut pas accéder
- **État cohérent** : L'application reste dans un état valide

### **Création du Guard d'authentification**

```typescript
// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), // Prendre seulement la première valeur
    map(user => {
      if (user) {
        return true; // Accès autorisé
      } else {
        // Rediriger vers login avec l'URL de retour
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false; // Accès refusé
      }
    })
  );
};
```

### **Création du Guard admin**

```typescript
// src/app/core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && user.role === 'admin') {
        return true; // Accès admin autorisé
      } else {
        // Rediriger vers la page d'accueil
        router.navigate(['/todos']);
        return false; // Accès refusé
      }
    })
  );
};
```

### **Application des Guards aux routes**

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full'
  },
  {
    path: 'todos',
    canActivate: [authGuard], // Protection par authentification
    loadChildren: () => import('./features/todos/todos.routes').then(m => m.TODOS_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], // Protection admin
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];

---

## 🧪 Test fonctionnel - Étape 2.2 : Guards de Protection

### **Vérifications à effectuer :**

#### **1. Test du AuthGuard**
```bash
# Aller sur http://localhost:4200/todos (sans être connecté)
```

**✅ Tests à réaliser :**
- [ ] Redirection automatique vers `/auth/login`
- [ ] L'URL de retour est sauvegardée dans les query params
- [ ] Après connexion, retour automatique vers `/todos`

#### **2. Test du AdminGuard**
```bash
# Se connecter avec un compte utilisateur normal
# user@example.com / user123

# Essayer d'accéder à http://localhost:4200/admin
```

**✅ Tests à réaliser :**
- [ ] Redirection vers `/todos` (accès refusé)
- [ ] Se connecter avec `admin@example.com` / `admin123`
- [ ] Accès à `/admin` autorisé

#### **3. Test de la navigation**
- [ ] Cliquer sur "Admin" dans le header (si connecté en tant qu'admin)
- [ ] Vérifier que la navigation fonctionne correctement
- [ ] Tester la déconnexion et vérifier les redirections

**🔧 Debug en cas de problème :**
```bash
# Vérifier les routes dans la console
F12 → Console → Vérifier les logs de navigation

# Vérifier que les guards sont bien appliqués
ng build --configuration development
```
```

### **Explication technique : CanActivateFn vs CanActivate**

#### **🆕 CanActivateFn (Angular 14+)**
- **Functional Guards** : Plus moderne et flexible
- **Injection simplifiée** : Utilise `inject()` au lieu du constructeur
- **Tree-shaking** : Meilleure optimisation du bundle
- **Composition** : Plus facile de combiner plusieurs guards

#### **🔄 Observable vs Promise**
- **Observable** : Permet l'annulation et la réactivité
- **take(1)** : Évite les fuites mémoire en se désabonnant automatiquement
- **map()** : Transforme la valeur sans créer de nouvel Observable

---

## 🔄 Étape 2.3 : Lazy Loading Avancé

### **Pourquoi le Lazy Loading ?**

Le lazy loading améliore significativement les performances :

#### **⚡ Performance**
- **Bundle initial réduit** : Seuls les modules nécessaires sont chargés
- **Chargement à la demande** : Les modules se chargent quand on en a besoin
- **Cache intelligent** : Les modules restent en cache après premier chargement

#### **📱 Expérience mobile**
- **Temps de chargement réduit** : Particulièrement important sur mobile
- **Bande passante économisée** : Seulement ce qui est nécessaire
- **Batterie préservée** : Moins de traitement initial

### **Configuration du lazy loading**

```typescript
// src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
```

### **Composant Register avec validation avancée**

```typescript
// src/app/features/auth/components/register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Validateur personnalisé pour la confirmation de mot de passe
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <!-- Nom -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('name')"
            />
            @if (isFieldInvalid('name')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('name') }}
              </p>
            }
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('email') }}
              </p>
            }
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('password') }}
              </p>
            }
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="isFieldInvalid('confirmPassword')"
            />
            @if (isFieldInvalid('confirmPassword')) {
              <p class="mt-1 text-sm text-red-600">
                {{ getFieldError('confirmPassword') }}
              </p>
            }
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              @if (loading()) {
                <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Création en cours...
              } @else {
                Créer le compte
              }
            </button>
          </div>

          <!-- Error Message -->
          @if (error()) {
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-sm text-red-600">{{ error() }}</p>
            </div>
          }
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string>('');

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set('');

      const { confirmPassword, ...userData } = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: (user) => {
          this.loading.set(false);
          this.router.navigate(['/todos']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.message || 'Erreur lors de la création du compte');
        }
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
      if (field.errors['email']) return 'Format d\'email invalide';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }
}
```

### **Explication technique : Validateurs personnalisés**

#### **🔧 Validateur personnalisé**
- **Fonction pure** : Pas d'effets de bord, facilement testable
- **Validation croisée** : Peut accéder à plusieurs contrôles
- **Réutilisabilité** : Peut être utilisé dans d'autres formulaires

#### **📊 Validators Angular**
- **Validators.required** : Champ obligatoire
- **Validators.email** : Format email valide
- **Validators.minLength(n)** : Longueur minimale
- **Validators.pattern(regex)** : Expression régulière

---

## 🧪 Test fonctionnel - Étape 2.3 : Lazy Loading et Register

### **Vérifications à effectuer :**

#### **1. Test du formulaire de register**
```bash
# Aller sur http://localhost:4200/auth/register
```

**✅ Tests à réaliser :**
- [ ] Le formulaire s'affiche correctement avec tous les champs
- [ ] Validation du nom (minimum 2 caractères)
- [ ] Validation de l'email (format valide)
- [ ] Validation du mot de passe (minimum 6 caractères)
- [ ] Validation de la confirmation de mot de passe
- [ ] Les mots de passe doivent correspondre
- [ ] Création d'un nouveau compte fonctionne

#### **2. Test du lazy loading**
```bash
# Ouvrir les DevTools (F12)
# Aller dans l'onglet Network
# Naviguer entre les pages
```

**✅ Tests à réaliser :**
- [ ] Chargement initial rapide (pas de gros bundle)
- [ ] Nouveaux chunks chargés lors de la navigation
- [ ] Les modules se chargent à la demande
- [ ] Pas d'erreurs de chargement dans la console

#### **3. Test de la validation croisée**
- [ ] Taper des mots de passe différents → erreur
- [ ] Corriger pour qu'ils correspondent → erreur disparaît
- [ ] Le bouton s'active seulement si tout est valide

**🔧 Debug en cas de problème :**
```bash
# Vérifier les erreurs de compilation
ng build --configuration development

# Vérifier les chunks générés
ng build --stats-json
```

## 🎨 Étape 2.4 : Interface Admin

### **Pourquoi une interface admin ?**

L'interface admin permet de gérer l'application de manière centralisée :

#### **👥 Gestion des utilisateurs**
- **Création/suppression** : Gérer les comptes utilisateurs
- **Attribution de rôles** : Donner des permissions spécifiques
- **Surveillance** : Voir qui utilise l'application

#### **📋 Gestion des tickets**
- **Répartition** : Assigner des tickets aux utilisateurs
- **Suivi** : Voir l'état de tous les tickets
- **Modération** : Supprimer ou modifier des tickets

### **Composant Admin principal**

```typescript
// src/app/features/admin/components/admin.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { TodoService } from '../../todos/services/todo.service';
import { User, Todo } from '../../auth/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Interface d'Administration</h1>
        <p class="text-gray-600 mt-2">Gérez les utilisateurs et les tickets</p>
      </div>

      <!-- Navigation Admin -->
      <div class="mb-8">
        <nav class="flex space-x-4">
          <button
            (click)="activeTab = 'users'"
            [class.bg-blue-600]="activeTab === 'users'"
            [class.text-white]="activeTab === 'users'"
            [class.text-gray-700]="activeTab !== 'users'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Utilisateurs
          </button>
          <button
            (click)="activeTab = 'tickets'"
            [class.bg-blue-600]="activeTab === 'tickets'"
            [class.text-white]="activeTab === 'tickets'"
            [class.text-gray-700]="activeTab !== 'tickets'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Tickets
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      @if (activeTab === 'users') {
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
          </div>
          <div class="p-6">
            @if (users().length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (user of users(); track user.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span class="text-sm font-medium text-gray-700">
                                  {{ user.name.charAt(0).toUpperCase() }}
                                </span>
                              </div>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                              <div class="text-sm text-gray-500">{{ user.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            [class.bg-red-100]="user.role === 'admin'"
                            [class.text-red-800]="user.role === 'admin'"
                            [class.bg-green-100]="user.role === 'user'"
                            [class.text-green-800]="user.role === 'user'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          >
                            {{ user.role | titlecase }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          @if (user.role !== 'admin') {
                            <button
                              (click)="deleteUser(user.id)"
                              class="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          } @else {
                            <span class="text-gray-400">Admin protégé</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="text-gray-500 text-center py-8">Aucun utilisateur trouvé</p>
            }
          </div>
        </div>
      }

      @if (activeTab === 'tickets') {
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Gestion des Tickets</h2>
          </div>
          <div class="p-6">
            @if (todos().length > 0) {
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priorité
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigné à
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (todo of todos(); track todo.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ todo.title }}</div>
                          @if (todo.description) {
                            <div class="text-sm text-gray-500">{{ todo.description }}</div>
                          }
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            [class.bg-yellow-100]="todo.status === 'todo'"
                            [class.text-yellow-800]="todo.status === 'todo'"
                            [class.bg-blue-100]="todo.status === 'in-progress'"
                            [class.text-blue-800]="todo.status === 'in-progress'"
                            [class.bg-green-100]="todo.status === 'done'"
                            [class.text-green-800]="todo.status === 'done'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          >
                            {{ todo.status | titlecase }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            [class.bg-red-100]="todo.priority === 'high'"
                            [class.text-red-800]="todo.priority === 'high'"
                            [class.bg-yellow-100]="todo.priority === 'medium'"
                            [class.text-yellow-800]="todo.priority === 'medium'"
                            [class.bg-green-100]="todo.priority === 'low'"
                            [class.text-green-800]="todo.priority === 'low'"
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          >
                            {{ todo.priority | titlecase }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ todo.assignedTo || 'Non assigné' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            (click)="deleteTodo(todo.id)"
                            class="text-red-600 hover:text-red-900 mr-3"
                          >
                            Supprimer
                          </button>
                          <button
                            (click)="assignTodo(todo)"
                            class="text-blue-600 hover:text-blue-900"
                          >
                            Assigner
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="text-gray-500 text-center py-8">Aucun ticket trouvé</p>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private todoService = inject(TodoService);
  private router = inject(Router);

  activeTab = signal<'users' | 'tickets'>('users');
  users = signal<User[]>([]);
  todos = signal<Todo[]>([]);

  async ngOnInit() {
    // Vérifier que l'utilisateur est admin
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/todos']);
      return;
    }

    // Charger les données
    await this.loadUsers();
    await this.loadTodos();
  }

  async loadUsers() {
    try {
      const users = await this.authService.getAllUsers();
      this.users.set(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  }

  async loadTodos() {
    try {
      const todos = await this.todoService.getAllTodos();
      this.todos.set(todos);
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
    }
  }

  async deleteUser(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await this.authService.deleteUser(userId);
        await this.loadUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  async deleteTodo(todoId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await this.todoService.deleteTodo(todoId);
        await this.loadTodos();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  assignTodo(todo: Todo) {
    // TODO: Implémenter la logique d'assignation
    console.log('Assigner le ticket:', todo);
  }
}

---

## 🧪 Test fonctionnel - Étape 2.4 : Interface Admin

### **Vérifications à effectuer :**

#### **1. Test de l'accès admin**
```bash
# Se connecter en tant qu'admin
# admin@example.com / admin123

# Aller sur http://localhost:4200/admin
```

**✅ Tests à réaliser :**
- [ ] L'interface admin s'affiche correctement
- [ ] Les onglets "Utilisateurs" et "Tickets" sont présents
- [ ] La liste des utilisateurs s'affiche
- [ ] La liste des tickets s'affiche
- [ ] Les rôles sont correctement affichés (Admin/User)

#### **2. Test de la gestion des utilisateurs**
- [ ] Voir tous les utilisateurs dans le tableau
- [ ] Les admins sont marqués comme "protégés"
- [ ] Possibilité de supprimer un utilisateur normal
- [ ] Confirmation avant suppression

#### **3. Test de la gestion des tickets**
- [ ] Voir tous les tickets dans le tableau
- [ ] Les statuts sont correctement affichés (Todo, In Progress, Done)
- [ ] Les priorités sont correctement affichées (High, Medium, Low)
- [ ] Possibilité de supprimer un ticket
- [ ] Bouton "Assigner" présent (fonctionnalité à implémenter)

#### **4. Test de la navigation**
- [ ] Changement d'onglet fonctionne
- [ ] Les données se rechargent correctement
- [ ] Pas d'erreurs dans la console

**🔧 Debug en cas de problème :**
```bash
# Vérifier les permissions
F12 → Console → Vérifier les logs d'authentification

# Vérifier les données
F12 → Application → Local Storage → Vérifier le token
```
```

### **Explication technique : Signals vs Observables**

#### **📡 Signals (Angular 20+)**
- **Performance optimale** : Détection de changements ultra-rapide
- **Syntaxe simplifiée** : `signal()` et `computed()` plus intuitifs
- **Tree-shaking** : Meilleure optimisation du bundle
- **Réactivité granulaire** : Seuls les composants qui utilisent le signal se mettent à jour

#### **🔄 Observables (RxJS)**
- **Puissance** : Opérateurs avancés (map, filter, switchMap, etc.)
- **Annulation** : Possibilité d'annuler les requêtes
- **Composition** : Combinaison de plusieurs streams
- **Maturité** : Écosystème riche et stable

#### **🎯 Quand utiliser quoi ?**
- **Signals** : État local simple, performance critique
- **Observables** : Requêtes HTTP, événements complexes, composition de streams

---

## 🔧 Étape 2.5 : Intercepteurs HTTP

### **Pourquoi les Intercepteurs ?**

Les intercepteurs permettent de traiter toutes les requêtes HTTP de manière centralisée :

#### **🔐 Authentification**
- **Ajout automatique des tokens** : Pas besoin de les ajouter manuellement
- **Gestion des erreurs 401** : Redirection automatique vers login
- **Refresh des tokens** : Renouvellement transparent

#### **📊 Monitoring**
- **Logs centralisés** : Toutes les requêtes sont loggées
- **Métriques** : Temps de réponse, taux d'erreur
- **Debugging** : Facilite le débogage des problèmes réseau

### **Création de l'intercepteur d'authentification**

```typescript
// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Ajouter le token d'authentification si disponible
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expiré ou invalide
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
```

### **Configuration de l'intercepteur**

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### **Explication technique : Intercepteurs vs Middleware**

#### **🔧 Intercepteurs Angular**
- **Côté client** : Exécutés dans le navigateur
- **Modification des requêtes** : Ajout d'headers, transformation du body
- **Gestion des réponses** : Transformation des données, gestion d'erreurs
- **Chaînage** : Plusieurs intercepteurs peuvent s'enchaîner

#### **🔄 Ordre d'exécution**
1. **Intercepteurs sortants** : Modifient les requêtes avant envoi
2. **Requête HTTP** : Envoi au serveur
3. **Intercepteurs entrants** : Traitent la réponse
4. **Composant** : Reçoit les données finales

---

## 🧪 Test fonctionnel - Étape 2.5 : Intercepteurs HTTP

### **Vérifications à effectuer :**

#### **1. Test de l'intercepteur d'authentification**
```bash
# Ouvrir les DevTools (F12)
# Aller dans l'onglet Network
# Se connecter à l'application
```

**✅ Tests à réaliser :**
- [ ] Les requêtes HTTP incluent le header `Authorization: Bearer <token>`
- [ ] Le token est automatiquement ajouté aux requêtes
- [ ] Pas d'erreur 401 lors des requêtes authentifiées

#### **2. Test de la gestion des erreurs 401**
```bash
# Simuler une erreur 401 (token expiré)
# Modifier le token dans le localStorage pour le rendre invalide
```

**✅ Tests à réaliser :**
- [ ] Redirection automatique vers `/auth/login` en cas d'erreur 401
- [ ] Le token invalide est supprimé
- [ ] L'utilisateur est déconnecté automatiquement

#### **3. Test des requêtes non authentifiées**
- [ ] Les requêtes vers `/auth/*` ne doivent pas avoir de token
- [ ] Pas d'erreur pour les routes publiques
- [ ] Les requêtes vers les API protégées incluent le token

**🔧 Debug en cas de problème :**
```bash
# Vérifier les headers des requêtes
F12 → Network → Cliquer sur une requête → Headers

# Vérifier le token dans le localStorage
F12 → Application → Local Storage → Vérifier le token

# Vérifier les logs de l'intercepteur
F12 → Console → Vérifier les logs d'interception
```

---

## 🧪 Test fonctionnel - Validation complète de la Partie 2

### **Test d'intégration global**

#### **1. Parcours utilisateur complet**
```bash
# Test complet de l'application
```

**✅ Scénario à tester :**
1. [ ] Aller sur `/auth/register` et créer un nouveau compte
2. [ ] Se connecter avec le nouveau compte
3. [ ] Naviguer vers `/todos` et créer quelques tickets
4. [ ] Changer le statut des tickets
5. [ ] Se déconnecter et se reconnecter
6. [ ] Vérifier que les données persistent

#### **2. Parcours admin complet**
```bash
# Test de l'interface admin
```

**✅ Scénario à tester :**
1. [ ] Se connecter en tant qu'admin
2. [ ] Aller sur `/admin`
3. [ ] Voir la liste des utilisateurs et tickets
4. [ ] Supprimer un ticket
5. [ ] Supprimer un utilisateur (non admin)
6. [ ] Vérifier que les suppressions fonctionnent

#### **3. Test de sécurité**
- [ ] Essayer d'accéder à `/admin` sans être admin → redirection
- [ ] Essayer d'accéder à `/todos` sans être connecté → redirection
- [ ] Vérifier que les guards fonctionnent correctement

#### **4. Test des intercepteurs HTTP**
- [ ] Vérifier les logs dans la console lors des requêtes
- [ ] Tester les notifications toast (login, logout, erreurs)
- [ ] Vérifier que les tokens sont ajoutés aux headers
- [ ] Tester la gestion des erreurs 401/403/500

#### **5. Test de performance**
- [ ] Chargement initial rapide
- [ ] Navigation fluide entre les pages
- [ ] Lazy loading fonctionne
- [ ] Pas de fuites mémoire

**🎯 Critères de réussite :**
- ✅ Tous les formulaires fonctionnent avec validation
- ✅ L'authentification est sécurisée avec tokens JWT
- ✅ Les guards protègent les routes efficacement
- ✅ L'interface admin est complète avec statistiques
- ✅ Les intercepteurs gèrent les tokens et erreurs
- ✅ Système de notifications fonctionnel
- ✅ Pas d'erreurs dans la console
- ✅ Performance satisfaisante

---

## 🎯 État actuel de l'application

### **Fonctionnalités implémentées :**
- ✅ **Authentification complète** : Login/Register avec validation
- ✅ **Formulaires réactifs** : Validation en temps réel, gestion d'erreurs
- ✅ **Guards de protection** : AuthGuard et AdminGuard
- ✅ **Lazy loading** : Chargement à la demande des modules
- ✅ **Interface admin avancée** : Gestion des utilisateurs et tickets avec statistiques
- ✅ **Intercepteurs HTTP** : Gestion centralisée des requêtes et authentification
- ✅ **Validation avancée** : Validateurs personnalisés et gestion d'erreurs
- ✅ **Système de notifications** : Toast notifications avec ErrorService
- ✅ **Gestion des tokens JWT** : Authentification automatique avec intercepteurs

### **Concepts maîtrisés :**
- **ReactiveFormsModule** : FormBuilder, FormGroup, FormControl
- **Validators** : Built-in et personnalisés (passwordMatchValidator)
- **Route Guards** : CanActivateFn, protection des routes
- **Lazy Loading** : Performance et organisation du code
- **Interceptors HTTP** : Gestion centralisée des requêtes et authentification
- **Signals** : État réactif moderne d'Angular 20+
- **ErrorService** : Gestion centralisée des erreurs et notifications
- **Toast Notifications** : Interface utilisateur pour les feedbacks

### **Prêt pour la Partie 3 :**
- ✅ Formulaires complexes et validation avancée
- ✅ Gestion d'état avec Signals
- ✅ Services avec cache et optimisation
- ✅ Tests unitaires et d'intégration

---

*💡 **Conseil du mentor :** Les formulaires réactifs sont plus puissants que les formulaires template-driven. Prenez le temps de comprendre la différence et quand utiliser chacun. Les Guards et Intercepteurs sont essentiels pour la sécurité de vos applications.*

*🔧 **Conseil qualité :** La validation des formulaires est cruciale pour l'expérience utilisateur. Utilisez des validateurs personnalisés pour des règles métier complexes. Les Guards protègent votre application des accès non autorisés.*

*⚡ **Conseil ESLint :** Respectez toujours les règles de linting. Utilisez `inject()` au lieu de l'injection par constructeur, évitez les variables inutilisées, et préférez `console.warn`/`console.error` à `console.log`. Un code propre est plus maintenable.*

---

## 🚀 Préparation pour la Partie 3

### **Objectifs de la Partie 3 :**
- 🎨 **Composants réutilisables** : Création de composants génériques
- 🔄 **Gestion d'état avancée** : Services avec cache, optimisation
- 🧪 **Tests unitaires** : Tests des composants et services
- 📱 **Responsive design** : Interface adaptative
- 🎯 **Performance** : Optimisation et lazy loading avancé

### **Concepts à maîtriser :**
- **Composants standalone** : Architecture moderne d'Angular
- **Services avec cache** : Optimisation des performances
- **Tests unitaires** : Jasmine et TestBed
- **Responsive design** : Tailwind CSS avancé
- **Performance** : OnPush strategy, trackBy functions

### **Prérequis validés :**
- ✅ Authentification et autorisation
- ✅ Formulaires réactifs avec validation
- ✅ Guards et intercepteurs
- ✅ Interface admin fonctionnelle
- ✅ Architecture DDD solide

---

*🎯 **Prêt pour la Partie 3 !** Votre application a maintenant une authentification complète et des formulaires robustes. Dans la Partie 3, nous nous concentrerons sur la création de composants réutilisables et l'optimisation des performances.*
