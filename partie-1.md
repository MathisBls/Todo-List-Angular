# Partie 1 : Fondamentaux et Architecture DDD

## 🎯 Objectifs de la partie 1

À la fin de cette partie, vous serez capable de :
- ✅ Créer un projet Angular 20+
- ✅ Comprendre l'architecture DDD
- ✅ Créer des composants et utiliser le data binding
- ✅ Utiliser les directives structurelles modernes (`@if`, `@for`)
- ✅ Implémenter les pipes built-in
- ✅ Mettre en place le routing de base
- ✅ Utiliser les services et simuler des appels API

---

## 🚀 Étape 1 : Création du projet Angular

### **Prérequis**

#### **1. Vérifier/Installer Node.js**
```bash
# Vérifier si Node.js est installé
node --version
npm --version

# Si pas installé, télécharger depuis : https://nodejs.org/
# Ou installer via Homebrew (macOS)
brew install node

# Ou installer via Chocolatey (Windows)
choco install nodejs

# Version requise : Node.js 20+ pour Angular 20+
```

#### **2. Mettre à jour npm (optionnel mais recommandé)**
```bash
# Mettre à jour npm vers la dernière version
npm install -g npm@latest

# Vérifier la version
npm --version
```

#### **3. Autres prérequis**
- Git installé
- Compte GitHub créé

### **Création du projet**
```bash
# Installer Angular CLI globalement
npm install -g @angular/cli

# Créer le projet TodoList
ng new todo-list-app

# Réponses aux questions :
# - Would you like to add Angular routing? → Yes
# - Which stylesheet format would you like to use? → CSS (ou votre préférence)
# - Do you want to create a 'zoneless' application without zone.js (Developer Preview)? → No
# - Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? → No
```

### **Structure du projet créé**
```
todo-list-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── index.html
│   └── main.ts
├── package.json
└── angular.json
```

### **Lancer l'application**
```bash
cd todo-list-app
ng serve
# Ouvrir http://localhost:4200
```

---

## ⚙️ Étape 1.3 : Configuration du projet Angular

### **Fichiers de configuration principaux**

#### **1. angular.json - Configuration du workspace**
```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "todo-list-app": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/todo-list-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "scripts": []
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "buildTarget": "todo-list-app:build"
          }
        }
      }
    }
  }
}
```

**Explications :**
- **`projectType`** : Type d'application (application, library)
- **`sourceRoot`** : Dossier source du code
- **`prefix`** : Préfixe des sélecteurs de composants (`app-`)
- **`architect`** : Configuration des tâches (build, serve, test)

#### **2. tsconfig.json - Configuration TypeScript**
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

**Explications :**
- **`target`** : Version JavaScript cible (ES2022)
- **`strict`** : Mode strict TypeScript
- **`experimentalDecorators`** : Support des décorateurs Angular
- **`angularCompilerOptions`** : Options spécifiques au compilateur Angular

#### **3. package.json - Dépendances et scripts**
```json
{
  "name": "todo-list-app",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/platform-browser": "^20.0.0",
    "@angular/platform-browser-dynamic": "^20.0.0",
    "@angular/router": "^20.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "@angular/cli": "^20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.4.0"
  }
}
```

**Explications :**
- **`dependencies`** : Packages requis en production
- **`devDependencies`** : Packages requis uniquement en développement
- **`scripts`** : Commandes npm personnalisées

#### **4. main.ts - Point d'entrée de l'application**
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

**Explications :**
- **`bootstrapApplication`** : Démarre l'application Angular
- **`appConfig`** : Configuration globale de l'application
- **`AppComponent`** : Composant racine

#### **5. app.config.ts - Configuration de l'application**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

**Explications :**
- **`ApplicationConfig`** : Configuration globale
- **`providers`** : Services et dépendances disponibles globalement
- **`provideRouter`** : Configuration du routeur

### **Commandes Angular CLI utiles**

```bash
# Générer un composant
ng generate component mon-composant
ng g c mon-composant

# Générer un service
ng generate service mon-service
ng g s mon-service

# Générer un pipe
ng generate pipe mon-pipe
ng g p mon-pipe

# Générer une directive
ng generate directive ma-directive
ng g d ma-directive

# Construire pour la production
ng build --configuration production

# Lancer les tests
ng test

# Lancer le linter
ng lint
```

### **Structure des dossiers expliquée**

```
todo-list-app/
├── src/                    # Code source de l'application
│   ├── app/               # Composants, services, modules
│   ├── assets/            # Images, fonts, fichiers statiques
│   ├── index.html         # Page HTML principale
│   ├── main.ts            # Point d'entrée
│   ├── styles.css         # Styles globaux
│   └── app.config.ts      # Configuration de l'app
├── node_modules/          # Dépendances installées
├── angular.json           # Configuration du workspace
├── package.json           # Dépendances et scripts
├── tsconfig.json          # Configuration TypeScript
└── README.md              # Documentation
```

### **Variables d'environnement**

Créer `src/environments/environment.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'TodoList App'
};
```

Créer `src/environments/environment.prod.ts` :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.monapp.com',
  appName: 'TodoList App'
};
```

**Utilisation dans les services :**
```typescript
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = environment.apiUrl;
  
  // ...
}
```

---

## 📝 Étape 1.4 : Configuration Git et bonnes pratiques

### **Initialisation du repository Git**
```bash
# Créer un repository sur GitHub
# Puis cloner ou initialiser localement
git init
git add .
git commit -m "feat: initial commit - projet Angular TodoList"

# Lier au repository GitHub
git remote add origin https://github.com/votre-username/todo-list-app.git
git branch -M main
git push -u origin main
```

### **Convention de commits (Conventional Commits)**
```bash
# Format : type(scope): description

# Exemples de commits :
git commit -m "feat: ajouter composant TodoList"
git commit -m "feat(auth): implémenter service d'authentification"
git commit -m "fix: corriger bug dans la suppression de todos"
git commit -m "refactor: améliorer la structure des services"
git commit -m "docs: ajouter documentation des composants"
git commit -m "test: ajouter tests pour TodoService"
git commit -m "style: améliorer le CSS du header"
git commit -m "perf: optimiser les performances du composant"

# Types de commits :
# feat     : Nouvelle fonctionnalité
# fix      : Correction de bug
# docs     : Documentation
# style    : Formatage, CSS
# refactor : Refactoring
# test     : Tests
# chore    : Tâches de maintenance
# perf     : Amélioration de performance
```

### **Workflow Git recommandé**
```bash
# 1. Créer une branche pour chaque feature
git checkout -b feature/ajout-authentification

# 2. Développer et commiter régulièrement
git add .
git commit -m "feat: ajouter formulaire de connexion"

# 3. Pousser la branche
git push origin feature/ajout-authentification

# 4. Créer une Pull Request sur GitHub

# 5. Après validation, merger dans main
git checkout main
git pull origin main
git branch -d feature/ajout-authentification
```

### **Règles de commit obligatoires**
- ✅ **Un commit par fonctionnalité** : Pas de commits multiples
- ✅ **Messages descriptifs** : Expliquer le "quoi" et le "pourquoi"
- ✅ **Tests avant commit** : Vérifier que tout fonctionne
- ✅ **Code review** : Demander validation si possible

---



## 🔧 Étape 1.4 : Configuration ESLint et bonnes pratiques

#### **1. Installation et configuration ESLint**
```bash
# Installer ESLint pour Angular
ng add @angular-eslint/schematics

# Les fichiers de configuration sont créés automatiquement

# Installer des règles supplémentaires (avec --legacy-peer-deps si conflit)
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser --legacy-peer-deps
```

#### **2. Configuration ESLint (eslint.config.js)**
```javascript
// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // Règles strictes pour un code propre
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "no-trailing-spaces": "error",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
```

#### **3. Configuration Prettier (.prettierrc)**
```json
{
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

**💡 Prettier** : Formate automatiquement votre code selon des règles définies. Il s'occupe de l'indentation, des espaces, des guillemets, etc. pour que tout le code ait le même style.

#### **4. Configuration Husky pour les pre-commit hooks**
```bash
# Installer Husky
npm install --save-dev husky lint-staged

# Initialiser Husky (nouvelle syntaxe)
npx husky init

# Configurer le hook pre-commit
# Le fichier .husky/pre-commit sera créé automatiquement
# Contenu du fichier .husky/pre-commit :
npx lint-staged
```

**💡 Husky** : Exécute automatiquement des scripts avant chaque commit Git. Il peut lancer ESLint, Prettier, ou des tests pour s'assurer que le code est propre avant d'être commité.

#### **5. Configuration lint-staged (.lintstagedrc.json)**
```json
{
  "*.ts": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.html": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.css": [
    "prettier --write"
  ],
  "*.json": [
    "prettier --write"
  ]
}
```

**💡 lint-staged** : Exécute ESLint et Prettier uniquement sur les fichiers modifiés avant le commit. Cela rend les vérifications plus rapides et évite de traiter tous les fichiers du projet.

#### **6. Scripts package.json à ajouter**
```json
{
  "scripts": {
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "format": "prettier --write \"src/**/*.{ts,html,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,css,json}\"",
    "prepare": "husky"
  }
}
```

**💡 Scripts npm** : Commandes personnalisées pour lancer facilement ESLint, Prettier et Husky. `npm run lint` vérifie le code, `npm run format` le formate automatiquement.

#### **7. Configuration VS Code (.vscode/settings.json)**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "eslint.validate": [
    "javascript",
    "typescript",
    "html"
  ]
}
```

**💡 Configuration VS Code** : Configure l'éditeur pour formater automatiquement le code à la sauvegarde et corriger les erreurs ESLint. Cela rend le développement plus fluide.

---

## 🏗️ Étape 1.5 : Architecture DDD

### **Organisation des dossiers**
Créons la structure DDD dans `src/app/` :

```
src/app/
├── core/                    # Services globaux
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── error-handler.service.ts
│   └── guards/
│       └── auth.guard.ts
├── shared/                  # Composants réutilisables
│   ├── components/
│   │   ├── header/
│   │   └── footer/
│   ├── pipes/
│   └── directives/
├── features/                # Modules métier
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   └── todos/
│       ├── components/
│       ├── services/
│       └── models/
└── infrastructure/          # Couche infrastructure
    ├── http/
    ├── storage/
    └── mock-data/
```

### **Création des dossiers**
```bash
# Créer la structure DDD
mkdir -p src/app/core/services
mkdir -p src/app/core/guards
mkdir -p src/app/shared/components
mkdir -p src/app/shared/pipes
mkdir -p src/app/shared/directives
mkdir -p src/app/features/auth/components
mkdir -p src/app/features/auth/services
mkdir -p src/app/features/auth/models
mkdir -p src/app/features/todos/components
mkdir -p src/app/features/todos/services
mkdir -p src/app/features/todos/models
mkdir -p src/app/infrastructure/http
mkdir -p src/app/infrastructure/storage
mkdir -p src/app/infrastructure/mock-data
```

**💡 Architecture DDD** : Organisation du code par domaine métier plutôt que par technique. Chaque feature est autonome avec ses propres composants, services et modèles.

### **Règles de code obligatoires**

#### **✅ DO (À faire)**
```typescript
// ✅ Typage strict
const userName: string = 'John';
const userAge: number = 25;
const isActive: boolean = true;

// ✅ Interfaces explicites
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Fonctions typées
function getUserById(id: number): User | null {
  // Implementation
}

// ✅ Gestion d'erreurs
try {
  await this.todoService.createTodo(todo);
} catch (error) {
  console.error('Erreur lors de la création:', error);
}

// ✅ Noms descriptifs
const isUserAuthenticated = true;
const hasValidEmail = email.includes('@');
```

#### **❌ DON'T (À éviter)**
```typescript
// ❌ Pas de 'any'
const data: any = response.data;

// ❌ Pas de fonctions vides
function handleClick() {
  // TODO: Implémenter
}

// ❌ Pas de variables non utilisées
const unusedVariable = 'test';

// ❌ Pas de console.log en production
console.log('Debug info');

// ❌ Pas de noms non descriptifs
const x = 10;
const fn = () => {};

// ❌ Pas de == (utiliser ===)
if (value == null) { }

// ❌ Pas de var
var oldVariable = 'test';
```

### **Variables d'environnement**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'TodoList App'
};
```

Créer `src/environments/environment.prod.ts` :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.monapp.com',
  appName: 'TodoList App'
};
```

**Utilisation dans les services :**
```typescript
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = environment.apiUrl;
  
  // ...
}
```

---



---

## 📝 Étape 1.6 : Modèles de données

### **Créer les interfaces (src/app/features/auth/models/user.model.ts)**
```typescript
export interface User {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}
```

### **Créer les interfaces (src/app/features/todos/models/todo.model.ts)**
```typescript
export interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: number; // ID de l'utilisateur assigné
  createdBy: number;   // ID de l'utilisateur créateur
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: number;
}
```

---

## 🎨 Étape 1.7 : Composants de base

### **Header Component (src/app/shared/components/header/header.component.ts)**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">TodoList App</h1>
        <nav>
          <ul class="flex space-x-4">
            <li><a routerLink="/todos" class="hover:text-blue-200">Todos</a></li>
            <li><a routerLink="/admin" class="hover:text-blue-200">Admin</a></li>
            <li><button (click)="logout()" class="hover:text-blue-200">Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  logout() {
    // TODO: Implémenter la déconnexion
    console.log('Logout clicked');
  }
}
```

### **App Component (src/app/app.component.ts)**
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class AppComponent {
  title = 'todo-list-app';
}
```

---

## 🔗 Étape 1.8 : Routing de base

### **App Routing (src/app/app-routing.module.ts)**
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'todos',
    loadChildren: () => import('./features/todos/todos.routes').then(m => m.TODOS_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];
```

---

## 🔧 Étape 1.9 : Services et Mock Data

### **Créer le service Todo (src/app/features/todos/services/todo.service.ts)**
```typescript
import { Injectable, signal } from '@angular/core';
import { Todo, CreateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Apprendre Angular',
      description: 'Étudier les fondamentaux d\'Angular 20+',
      status: 'todo',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Créer un projet',
      description: 'Développer une application TodoList',
      status: 'in-progress',
      priority: 'medium',
      createdBy: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: 3,
      title: 'Configurer l\'environnement',
      description: 'Installer Node.js, Angular CLI et configurer VS Code',
      status: 'done',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-14')
    }
  ]);

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET - Récupérer tous les todos
  async getAllTodos(): Promise<Todo[]> {
    console.log('🔄 Service: Récupération de tous les todos...');
    await this.delay(300); // Simuler un appel API
    console.log('✅ Service: Todos récupérés avec succès');
    return this.todos();
  }

  // GET - Récupérer un todo par ID
  async getTodoById(id: number): Promise<Todo | undefined> {
    console.log(`🔄 Service: Récupération du todo ${id}...`);
    await this.delay(200);
    const todo = this.todos().find(t => t.id === id);
    console.log(`✅ Service: Todo ${id} récupéré:`, todo);
    return todo;
  }

  // POST - Créer un nouveau todo
  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    console.log('🔄 Service: Création d\'un nouveau todo...', todoData);
    await this.delay(400);
    
    const newTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description || '',
      status: 'todo',
      priority: todoData.priority,
      assignedTo: todoData.assignedTo,
      createdBy: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.todos.update(todos => [...todos, newTodo]);
    console.log('✅ Service: Todo créé avec succès:', newTodo);
    return newTodo;
  }

  // PUT - Mettre à jour un todo
  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    console.log(`🔄 Service: Mise à jour du todo ${id}...`, updates);
    await this.delay(300);
    
    let updatedTodo: Todo | undefined;
    this.todos.update(todos => 
      todos.map(todo => {
        if (todo.id === id) {
          updatedTodo = { 
            ...todo, 
            ...updates, 
            updatedAt: new Date() 
          };
          return updatedTodo;
        }
        return todo;
      })
    );
    
    console.log(`✅ Service: Todo ${id} mis à jour:`, updatedTodo);
    return updatedTodo;
  }

  // DELETE - Supprimer un todo
  async deleteTodo(id: number): Promise<boolean> {
    console.log(`🔄 Service: Suppression du todo ${id}...`);
    await this.delay(250);
    
    let deleted = false;
    this.todos.update(todos => {
      const initialLength = todos.length;
      const filtered = todos.filter(todo => todo.id !== id);
      deleted = filtered.length < initialLength;
      return filtered;
    });
    
    console.log(`✅ Service: Todo ${id} supprimé:`, deleted);
    return deleted;
  }

  // Méthodes utilitaires
  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter(todo => todo.status === status);
  }

  getTodosByPriority(priority: Todo['priority']): Todo[] {
    return this.todos().filter(todo => todo.priority === priority);
  }
}
```

### **Créer le service Auth (src/app/features/auth/services/auth.service.ts)**
```typescript
import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = signal<User[]>([
    {
      id: 1,
      email: 'admin@example.com',
      password: 'admin123', // En production, ce serait hashé
      role: 'admin',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      createdAt: new Date('2024-01-02')
    }
  ]);

  private currentUser = signal<User | null>(null);

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // POST - Connexion
  async login(credentials: LoginRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log('🔄 Service: Tentative de connexion...', credentials.email);
    await this.delay(500);
    
    const user = this.users().find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      this.currentUser.set(user);
      console.log('✅ Service: Connexion réussie pour:', user.email);
      return { success: true, user };
    } else {
      console.log('❌ Service: Échec de connexion pour:', credentials.email);
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }
  }

  // POST - Inscription
  async register(userData: RegisterRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log('🔄 Service: Tentative d\'inscription...', userData.email);
    await this.delay(600);
    
    // Vérifier si l'email existe déjà
    if (this.users().some(u => u.email === userData.email)) {
      console.log('❌ Service: Email déjà utilisé:', userData.email);
      return { success: false, error: 'Cet email est déjà utilisé' };
    }
    
    // Vérifier que les mots de passe correspondent
    if (userData.password !== userData.confirmPassword) {
      console.log('❌ Service: Mots de passe différents');
      return { success: false, error: 'Les mots de passe ne correspondent pas' };
    }
    
    const newUser: User = {
      id: Date.now(),
      email: userData.email,
      password: userData.password,
      role: 'user',
      createdAt: new Date()
    };
    
    this.users.update(users => [...users, newUser]);
    this.currentUser.set(newUser);
    
    console.log('✅ Service: Inscription réussie pour:', newUser.email);
    return { success: true, user: newUser };
  }

  // POST - Déconnexion
  async logout(): Promise<void> {
    console.log('🔄 Service: Déconnexion...');
    await this.delay(200);
    this.currentUser.set(null);
    console.log('✅ Service: Déconnexion réussie');
  }

  // GET - Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  // GET - Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // GET - Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  // GET - Récupérer tous les utilisateurs (admin seulement)
  async getAllUsers(): Promise<User[]> {
    console.log('🔄 Service: Récupération de tous les utilisateurs...');
    await this.delay(400);
    
    if (!this.isAdmin()) {
      throw new Error('Accès non autorisé');
    }
    
    console.log('✅ Service: Utilisateurs récupérés');
    return this.users().map(user => ({
      ...user,
      password: '***' // Masquer les mots de passe
    }));
  }
}
```

---

## 🎯 Étape 1.10 : Composant Todo List avec Services

### **Todo List Component (src/app/features/todos/components/todo-list.component.ts)**
```typescript
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-6">Mes Todos</h2>
      
      <!-- Loading state -->
      @if (loading()) {
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Chargement des todos...</p>
        </div>
      } @else {
        <!-- Formulaire d'ajout -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-xl font-semibold mb-4">Ajouter une tâche</h3>
          <form (ngSubmit)="addTodo()" #todoForm="ngForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                [(ngModel)]="newTodo.title" 
                name="title"
                placeholder="Titre de la tâche"
                class="border p-2 rounded"
                required>
              
              <input 
                type="text" 
                [(ngModel)]="newTodo.description" 
                name="description"
                placeholder="Description (optionnel)"
                class="border p-2 rounded">
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                [(ngModel)]="newTodo.priority" 
                name="priority"
                class="border p-2 rounded">
                <option value="low">Basse priorité</option>
                <option value="medium">Priorité moyenne</option>
                <option value="high">Haute priorité</option>
              </select>
              
              <button 
                type="submit" 
                [disabled]="!todoForm.form.valid || addingTodo()"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                @if (addingTodo()) {
                  <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Ajout en cours...
                } @else {
                  Ajouter
                }
              </button>
            </div>
          </form>
        </div>

        <!-- Liste des todos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Colonne Todo -->
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-700">
              À faire ({{ getTodosByStatus('todo').length }})
            </h3>
            @for (todo of getTodosByStatus('todo'); track todo.id) {
              <div class="bg-white p-4 rounded shadow mb-3">
                <h4 class="font-semibold">{{ todo.title }}</h4>
                @if (todo.description) {
                  <p class="text-gray-600 text-sm mt-1">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs px-2 py-1 rounded" 
                        [ngClass]="{
                          'bg-red-100 text-red-800': todo.priority === 'high',
                          'bg-yellow-100 text-yellow-800': todo.priority === 'medium',
                          'bg-green-100 text-green-800': todo.priority === 'low'
                        }">
                    {{ todo.priority | titlecase }}
                  </span>
                  <button 
                    (click)="updateStatus(todo.id, 'in-progress')"
                    class="text-blue-600 hover:text-blue-800">
                    Commencer
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Colonne In Progress -->
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-blue-700">
              En cours ({{ getTodosByStatus('in-progress').length }})
            </h3>
            @for (todo of getTodosByStatus('in-progress'); track todo.id) {
              <div class="bg-white p-4 rounded shadow mb-3">
                <h4 class="font-semibold">{{ todo.title }}</h4>
                @if (todo.description) {
                  <p class="text-gray-600 text-sm mt-1">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs px-2 py-1 rounded" 
                        [ngClass]="{
                          'bg-red-100 text-red-800': todo.priority === 'high',
                          'bg-yellow-100 text-yellow-800': todo.priority === 'medium',
                          'bg-green-100 text-green-800': todo.priority === 'low'
                        }">
                    {{ todo.priority | titlecase }}
                  </span>
                  <button 
                    (click)="updateStatus(todo.id, 'done')"
                    class="text-green-600 hover:text-green-800">
                    Terminer
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Colonne Done -->
          <div class="bg-gray-100 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-green-700">
              Terminé ({{ getTodosByStatus('done').length }})
            </h3>
            @for (todo of getTodosByStatus('done'); track todo.id) {
              <div class="bg-white p-4 rounded shadow mb-3 opacity-75">
                <h4 class="font-semibold line-through">{{ todo.title }}</h4>
                @if (todo.description) {
                  <p class="text-gray-600 text-sm mt-1 line-through">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                    {{ todo.priority | titlecase }}
                  </span>
                  <button 
                    (click)="deleteTodo(todo.id)"
                    class="text-red-600 hover:text-red-800">
                    Supprimer
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class TodoListComponent implements OnInit {
  todos = signal<Todo[]>([]);
  loading = signal(true);
  addingTodo = signal(false);

  newTodo = {
    title: '',
    description: '',
    priority: 'medium' as const
  };

  constructor(private todoService: TodoService) {}

  async ngOnInit() {
    await this.loadTodos();
  }

  async loadTodos() {
    try {
      this.loading.set(true);
      const todos = await this.todoService.getAllTodos();
      this.todos.set(todos);
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async addTodo() {
    if (this.newTodo.title.trim()) {
      try {
        this.addingTodo.set(true);
        await this.todoService.createTodo({
          title: this.newTodo.title,
          description: this.newTodo.description,
          priority: this.newTodo.priority
        });
        
        // Recharger les todos
        await this.loadTodos();
        
        // Réinitialiser le formulaire
        this.newTodo.title = '';
        this.newTodo.description = '';
      } catch (error) {
        console.error('Erreur lors de l\'ajout du todo:', error);
      } finally {
        this.addingTodo.set(false);
      }
    }
  }

  async updateStatus(id: number, status: Todo['status']) {
    try {
      await this.todoService.updateTodo(id, { status });
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  }

  async deleteTodo(id: number) {
    try {
      await this.todoService.deleteTodo(id);
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  // Méthodes utilitaires
  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter(todo => todo.status === status);
  }
}
```

---

## 🔧 Étape 1.11 : Configuration finale

### **Mettre à jour app.component.ts**
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { TodoListComponent } from './features/todos/components/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, TodoListComponent],
  template: `
    <app-header></app-header>
    <main class="container mx-auto p-4">
      <app-todo-list></app-todo-list>
    </main>
  `,
  styles: []
})
export class AppComponent {
  title = 'todo-list-app';
}
```

### **Ajouter Tailwind CSS et configuration complète**
```bash
# Installer Tailwind CSS v3 (version stable) et ses dépendances
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0

# Créer la configuration Tailwind
npx tailwindcss init
```

**⚠️ Important : Version de Tailwind CSS**
- **Utilisez Tailwind CSS v3.4.0** (version stable)
- **Évitez Tailwind CSS v4** (version expérimentale qui cause des erreurs)
- Si vous rencontrez l'erreur "Cannot use `tailwindcss` directly as a PostCSS plugin", c'est que vous avez la v4
- Solution : `npm uninstall tailwindcss` puis `npm install -D tailwindcss@^3.4.0`

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**postcss.config.js**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**src/styles.scss**
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Configuration VS Code pour Tailwind (.vscode/settings.json)**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "eslint.validate": [
    "javascript",
    "typescript",
    "html"
  ],
  "css.validate": false,
  "scss.validate": false,
  "less.validate": false,
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["class\\s*=\\s*['\"`]([^'\"`]*).*?['\"`]", "([^'\"`]*)"]
  ]
}
```

**💡 Configuration Tailwind** : Tailwind CSS fournit des classes utilitaires pour un développement rapide. La configuration PostCSS permet de traiter les directives @tailwind. La configuration VS Code désactive les erreurs de validation CSS et ajoute le support Tailwind.

---

## 🧪 Test et Validation de la Partie 1

### **Vérification de l'installation**
```bash
# Vérifier que tout fonctionne
npm run lint
ng serve

# Ouvrir http://localhost:4200
# Vérifier que l'application se lance sans erreur
```

### **Test des fonctionnalités**
1. ✅ **Interface TodoList** : Voir les 3 colonnes (À faire, En cours, Terminé)
2. ✅ **Ajout de todo** : Remplir le formulaire et ajouter une tâche
3. ✅ **Changement de statut** : Cliquer sur "Commencer" puis "Terminer"
4. ✅ **Suppression** : Supprimer une tâche terminée
5. ✅ **Priorités** : Voir les badges de couleur selon la priorité
6. ✅ **Loading states** : Voir les spinners pendant les opérations

### **Test des services**
1. ✅ **Console du navigateur** : Voir les logs des appels API simulés
2. ✅ **Délais** : Observer les délais artificiels (200-600ms)

### **Vérification de la structure des fichiers**
```bash
# Structure finale attendue
src/app/
├── app.component.ts          # Composant principal
├── app.config.ts            # Configuration de l'app
├── app.routes.ts            # Routes principales
├── app.scss                 # Styles globaux
├── core/                    # Services et guards
├── shared/                  # Composants partagés
│   └── components/
│       └── header/
│           └── header.component.ts
├── features/                # Modules fonctionnels
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── components/
│   │   ├── models/
│   │   │   └── user.model.ts
│   │   └── services/
│   ├── todos/
│   │   ├── todos.routes.ts
│   │   ├── components/
│   │   │   └── todo-list.component.ts
│   │   ├── models/
│   │   │   └── todo.model.ts
│   │   └── services/
│   │       └── todo.service.ts
│   └── admin/
│       └── admin.routes.ts
└── infrastructure/          # Couche infrastructure
```

### **Fichiers de configuration requis**
```bash
# Fichiers de configuration
├── angular.json             # Configuration Angular
├── tailwind.config.js       # Configuration Tailwind
├── postcss.config.js        # Configuration PostCSS
├── eslint.config.js         # Configuration ESLint
├── .prettierrc             # Configuration Prettier
├── .lintstagedrc.json      # Configuration lint-staged
└── .husky/                 # Hooks Git
    └── pre-commit
```
3. ✅ **Gestion d'erreurs** : Vérifier les try/catch dans la console

### **Test de la configuration**
1. ✅ **ESLint** : `npm run lint` ne doit pas avoir d'erreurs
2. ✅ **Pre-commit hook** : Essayer de commiter avec une erreur ESLint
3. ✅ **Formatage** : Vérifier que Prettier formate automatiquement
4. ✅ **Tailwind** : Vérifier que les classes CSS fonctionnent

---

## 🎯 État actuel de l'application

### **Fonctionnalités implémentées :**
- ✅ **Architecture DDD** : Structure de dossiers organisée par domaine
- ✅ **Composants** : Header, TodoList avec interface Kanban
- ✅ **Services** : TodoService et AuthService avec mock data
- ✅ **Data binding** : Two-way binding avec ngModel
- ✅ **Directives** : @if, @for (nouveau control flow Angular 20+)
- ✅ **Pipes** : titlecase pour l'affichage des priorités
- ✅ **Signals** : Gestion d'état réactive
- ✅ **Routing** : Configuration de base (prêt pour les prochaines parties)
- ✅ **Styling** : Tailwind CSS avec interface moderne

### **Données de test disponibles :**
- **Utilisateurs** : admin@example.com (admin123), user@example.com (user123)
- **Todos** : 3 todos pré-chargés avec différents statuts et priorités

### **Prêt pour la Partie 2 :**
- ✅ Authentification (login/register)
- ✅ Routing avancé avec lazy loading
- ✅ Formulaires réactifs
- ✅ Guards de protection

---

*💡 **Conseil du mentor :** Prenez le temps de tester chaque fonctionnalité. Les services avec mock data vous donnent une vraie expérience de développement frontend. Observez les logs dans la console pour comprendre le flux des données.*

*🔧 **Conseil qualité :** La Partie 1 pose les fondations solides. L'architecture DDD et les bonnes pratiques vous serviront pour toute la suite du cours et dans vos projets professionnels.*

---

## 🚀 Préparation pour la Partie 2

### **Objectifs de la Partie 2 :**
- 🔐 **Authentification complète** : Login/Register avec formulaires réactifs
- 🛡️ **Guards de protection** : Protection des routes selon le rôle
- 🔄 **Routing avancé** : Lazy loading des modules
- 📝 **Formulaires réactifs** : FormBuilder, Validators, gestion d'erreurs
- 🎨 **Interface admin** : Gestion des utilisateurs et attribution des tickets

### **Concepts à maîtriser :**
- **ReactiveFormsModule** : FormBuilder, FormGroup, FormControl
- **Validators** : Required, Email, MinLength, Pattern
- **Route Guards** : CanActivate, CanDeactivate
- **Lazy Loading** : Chargement à la demande des modules
- **Interceptors** : Gestion des tokens d'authentification

### **Prérequis validés :**
- ✅ Architecture DDD en place
- ✅ Services avec mock data fonctionnels
- ✅ Composants de base créés
- ✅ Configuration ESLint/Prettier active
- ✅ Git et bonnes pratiques configurés

---

*🎯 **Prêt pour la Partie 2 !** Votre application TodoList a maintenant une base solide avec une architecture propre et des fonctionnalités de base. Dans la Partie 2, nous ajouterons l'authentification et les formulaires réactifs pour créer une expérience utilisateur complète.* 