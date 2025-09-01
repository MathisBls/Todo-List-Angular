# Partie 4 : Tests, Performance et Déploiement

## 🎯 Objectifs de la Partie 4

À la fin de cette partie, vous serez capable de :
- ✅ Écrire des tests unitaires, d'intégration et e2e avec Angular
- ✅ Optimiser les performances avec OnPush strategy, trackBy, lazy loading
- ✅ Configurer et déployer une application Angular en production
- ✅ Appliquer les bonnes pratiques de code review et refactoring

---

## 🧪 Étape 4.1 : Tests Unitaires et d'Intégration

### **Pourquoi les tests sont essentiels ?**

Les tests garantissent la **qualité du code** et la **fiabilité de l'application** :
- **🔍 Détection précoce des bugs** : Problèmes identifiés avant la production
- **🛡️ Refactoring sécurisé** : Modifications sans casser les fonctionnalités existantes
- **📚 Documentation vivante** : Les tests expliquent le comportement attendu
- **🚀 Confiance en déploiement** : Déploiement automatique avec tests automatisés

### **Types de tests Angular**

#### **1. Tests unitaires (Unit Tests)**
Testent une **fonction ou classe isolée** :
```typescript
// Test d'un service
describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should add todo correctly', () => {
    const todo = { id: '1', title: 'Test', status: 'todo' };
    service.addTodo(todo);
    expect(service.todos().length).toBe(1);
  });
});
```

#### **2. Tests d'intégration (Integration Tests)**
Testent l'**interaction entre composants** :
```typescript
// Test d'un composant avec ses dépendances
describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', ['getAllTodos']);
    spy.getAllTodos.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should load todos on init', () => {
    fixture.detectChanges();
    expect(todoService.getAllTodos).toHaveBeenCalled();
  });
});
```

### **Tests des composants personnalisés**

#### **1. Test du PriorityPipe**
```typescript
// src/app/shared/pipes/priority.pipe.spec.ts
import { PriorityPipe } from './priority.pipe';

describe('PriorityPipe', () => {
  let pipe: PriorityPipe;

  beforeEach(() => {
    pipe = new PriorityPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate low priority to "Faible"', () => {
    expect(pipe.transform('low')).toBe('Faible');
  });

  it('should translate medium priority to "Moyenne"', () => {
    expect(pipe.transform('medium')).toBe('Moyenne');
  });

  it('should translate high priority to "Haute"', () => {
    expect(pipe.transform('high')).toBe('Haute');
  });

  it('should return original value for unknown priority', () => {
    expect(pipe.transform('unknown' as any)).toBe('unknown');
  });
});
```

#### **2. Test du TodoService avec Signals**
```typescript
// src/app/features/todos/services/todo.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { Todo } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty todos', () => {
    expect(service.todos().length).toBe(0);
  });

  it('should add todo correctly', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    service.addTodo(todo);
    expect(service.todos().length).toBe(1);
    expect(service.todos()[0]).toEqual(todo);
  });

  it('should compute completed todos correctly', () => {
    const todo1: Todo = { id: '1', title: 'Todo 1', status: 'done', priority: 'low', createdAt: new Date(), updatedAt: new Date() };
    const todo2: Todo = { id: '2', title: 'Todo 2', status: 'todo', priority: 'medium', createdAt: new Date(), updatedAt: new Date() };

    service.addTodo(todo1);
    service.addTodo(todo2);

    expect(service.completedTodos().length).toBe(1);
    expect(service.completedTodos()[0].id).toBe('1');
  });

  it('should compute pending todos correctly', () => {
    const todo1: Todo = { id: '1', title: 'Todo 1', status: 'todo', priority: 'low', createdAt: new Date(), updatedAt: new Date() };
    const todo2: Todo = { id: '2', title: 'Todo 2', status: 'in-progress', priority: 'medium', createdAt: new Date(), updatedAt: new Date() };

    service.addTodo(todo1);
    service.addTodo(todo2);

    expect(service.pendingTodos().length).toBe(1);
    expect(service.pendingTodos()[0].id).toBe('1');
  });

  it('should compute in-progress todos correctly', () => {
    const todo1: Todo = { id: '1', title: 'Todo 1', status: 'todo', priority: 'low', createdAt: new Date(), updatedAt: new Date() };
    const todo2: Todo = { id: '2', title: 'Todo 2', status: 'in-progress', priority: 'medium', createdAt: new Date(), updatedAt: new Date() };

    service.addTodo(todo1);
    service.addTodo(todo2);

    expect(service.inProgressTodos().length).toBe(1);
    expect(service.inProgressTodos()[0].id).toBe('2');
  });

  it('should compute stats correctly', () => {
    const todo1: Todo = { id: '1', title: 'Todo 1', status: 'done', priority: 'high', createdAt: new Date(), updatedAt: new Date() };
    const todo2: Todo = { id: '2', title: 'Todo 2', status: 'todo', priority: 'medium', createdAt: new Date(), updatedAt: new Date() };
    const todo3: Todo = { id: '3', title: 'Todo 3', status: 'in-progress', priority: 'high', createdAt: new Date(), updatedAt: new Date() };

    service.addTodo(todo1);
    service.addTodo(todo2);
    service.addTodo(todo3);

    const stats = service.todoStats();
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(1);
    expect(stats.inProgress).toBe(1);
    expect(stats.highPriority).toBe(2);
    expect(stats.completionRate).toBe(33.33333333333333);
  });
});
```

---

## ⚡ Étape 4.2 : Optimisations de Performance

### **Pourquoi optimiser les performances ?**

Les optimisations améliorent l'**expérience utilisateur** et la **réactivité de l'application** :
- **🚀 Temps de chargement réduit** : Pages plus rapides
- **⚡ Interactions fluides** : Pas de lag lors des interactions
- **📱 Support mobile** : Applications performantes sur tous les appareils
- **💰 Coûts réduits** : Moins de ressources serveur nécessaires

### **Stratégies d'optimisation Angular**

#### **1. ChangeDetectionStrategy.OnPush**
```typescript
// src/app/features/todos/components/todo-list.component.ts
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, PriorityPipe, HighlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ Optimisation
  template: `...`
})
export class TodoListComponent {
  todoService = inject(TodoService);
}
```

**Avantages :**
- Détection de changements uniquement quand les références changent
- Réduction drastique des cycles de détection
- Performance améliorée pour les gros composants

#### **2. TrackBy pour les listes**
```typescript
// src/app/features/todos/components/todo-list.component.ts
export class TodoListComponent {
  todoService = inject(TodoService);

  // ⚡ Optimisation : TrackBy pour éviter la recréation des éléments
  trackByTodoId(index: number, todo: Todo): string {
    return todo.id;
  }
}
```

```html
<!-- Template avec trackBy -->
@for (todo of todoService.pendingTodos(); track trackByTodoId) {
  <div class="todo-item">
    {{ todo.title }}
  </div>
}
```

#### **3. Lazy Loading avancé**
```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'todos',
    loadChildren: () => import('./features/todos/todos.routes').then(m => m.TODOS_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, adminGuard]
  }
];
```

#### **4. Optimisation des bundles**
```typescript
// angular.json
{
  "projects": {
    "angular-todolist": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kb",
                  "maximumError": "10kb"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

---

## 🚀 Étape 4.3 : Build et Déploiement

### **Configuration de production**

#### **1. Variables d'environnement**
```typescript
// src/environments/environment.ts (développement)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  version: '1.0.0'
};
```

```typescript
// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.monapp.com',
  version: '1.0.0'
};
```

#### **2. Configuration de build**
```json
// angular.json - Configuration production
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
        }
      ],
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

### **Déploiement sur différentes plateformes**

#### **1. Déploiement sur Vercel**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/angular-todolist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### **2. Déploiement sur Netlify**
```toml
# netlify.toml
[build]
  publish = "dist/angular-todolist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### **3. CI/CD Pipeline complet**
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm test -- --watch=false --browsers=ChromeHeadless
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to production
      run: |
        # Déploiement selon la plateforme choisie
        echo "Deploying to production..."
```

---

## 📋 Étape 4.4 : Bonnes Pratiques et Code Review

### **Standards de code**

#### **1. ESLint Configuration avancée**
```javascript
// eslint.config.js
import js from '@eslint/js';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      '@angular-eslint': angular,
    },
    rules: {
      ...angular.configs.recommended.rules,
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/use-component-selector': 'error',
      '@angular-eslint/use-directive-selector': 'error',
      '@angular-eslint/no-conflicting-lifecycle': 'error',
      '@angular-eslint/no-host-metadata-property': 'error',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      '@angular-eslint/no-outputs-metadata-property': 'error',
      '@angular-eslint/no-queries-metadata-property': 'error',
      '@angular-eslint/contextual-lifecycle': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/pipe-prefix': 'error',
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case'
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ]
    }
  }
];
```

#### **2. Husky Hooks avancés**
```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "test": "ng test",
    "test:coverage": "ng test --code-coverage",
    "e2e": "ng e2e",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "analyze": "ng build --stats-json && webpack-bundle-analyzer dist/angular-todolist/stats.json"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:coverage"
    }
  },
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{html,css,scss,json,md}": [
      "prettier --write"
    ]
  }
}
```

### **Code Review Checklist**

#### **1. Checklist Générale**
- [ ] **Lisibilité** : Le code est-il facile à comprendre ?
- [ ] **Performance** : Y a-t-il des optimisations possibles ?
- [ ] **Sécurité** : Y a-t-il des vulnérabilités potentielles ?
- [ ] **Tests** : Les tests couvrent-ils les nouveaux cas ?
- [ ] **Documentation** : Les changements sont-ils documentés ?

#### **2. Checklist Angular Spécifique**
- [ ] **Signals** : Utilisation correcte des Signals vs Observables ?
- [ ] **OnPush** : ChangeDetectionStrategy.OnPush utilisé quand approprié ?
- [ ] **TrackBy** : TrackBy utilisé pour les listes ?
- [ ] **Lazy Loading** : Modules chargés de manière lazy ?
- [ ] **Injection** : `inject()` utilisé au lieu du constructeur ?
- [ ] **Standalone** : Composants standalone utilisés ?
- [ ] **Types** : Types TypeScript stricts utilisés ?

#### **3. Checklist Performance**
- [ ] **Bundle Size** : Taille du bundle optimisée ?
- [ ] **Images** : Images optimisées et lazy loaded ?
- [ ] **Caching** : Stratégie de cache appropriée ?
- [ ] **CDN** : Ressources statiques servies via CDN ?
- [ ] **Compression** : Gzip/Brotli activé ?

### **Documentation du code**

#### **1. JSDoc pour les services**
```typescript
/**
 * Service de gestion des todos avec Signals
 * 
 * Ce service utilise les Signals d'Angular 20+ pour une gestion d'état
 * performante et réactive. Il fournit des computed signals pour
 * les statistiques et le filtrage des todos.
 * 
 * @example
 * ```typescript
 * const todoService = inject(TodoService);
 * const completedTodos = todoService.completedTodos();
 * const stats = todoService.todoStats();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  /**
   * Signal writable contenant tous les todos
   * @private
   */
  private todos = signal<Todo[]>([]);

  /**
   * Signal readonly pour accéder aux todos depuis l'extérieur
   */
  public todos$ = this.todos.asReadonly();

  /**
   * Signal computed pour les todos complétés
   * @returns {Signal<Todo[]>} Todos avec status 'done'
   */
  public completedTodos = computed(() => 
    this.todos().filter(todo => todo.status === 'done')
  );

  /**
   * Ajoute un nouveau todo
   * @param {Todo} todo - Le todo à ajouter
   * @returns {Promise<Todo>} Le todo ajouté avec ID généré
   */
  async addTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.todos.update(todos => [...todos, newTodo]);
    return newTodo;
  }

  /**
   * Génère un ID unique pour un todo
   * @private
   * @returns {string} ID unique
   */
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
```

---

## 🎯 État actuel de l'application

### **Fonctionnalités implémentées :**
- ✅ **Tests complets** : Unit, integration et e2e tests
- ✅ **Optimisations de performance** : OnPush strategy, trackBy, lazy loading
- ✅ **Build de production** : Configuration optimisée
- ✅ **Déploiement** : Multi-plateformes (Vercel, Netlify, GitHub Pages, Firebase)
- ✅ **CI/CD** : Pipeline automatisé avec tests et déploiement
- ✅ **Bonnes pratiques** : ESLint strict, Prettier, Husky hooks
- ✅ **Documentation** : JSDoc, README complet

### **Concepts maîtrisés :**
- **Tests Angular** : Jasmine, TestBed, ComponentFixture, Playwright
- **Performance** : ChangeDetectionStrategy, OnPush, trackBy, lazy loading
- **Build et déploiement** : Angular CLI, multi-environnements, CI/CD
- **Bonnes pratiques** : Code review, refactoring, documentation

### **Prêt pour la Partie 5 :**
- ✅ Tests complets et automatisés
- ✅ Performance optimisée
- ✅ Déploiement automatisé
- ✅ Code de qualité professionnelle

---

*💡 **Conseil du mentor :** Les tests ne sont pas une option, ils sont essentiels pour maintenir la qualité du code. Prenez l'habitude d'écrire des tests pour chaque nouvelle fonctionnalité.*

*🔧 **Conseil qualité :** Utilisez toujours OnPush strategy pour les composants qui ne changent pas souvent. Cela améliore drastiquement les performances.*

---

## 🚀 Préparation pour la Partie 5

### **Objectifs de la Partie 5 :**
- 🎯 **Projet final complet** : Application TodoList étendue
- 🔧 **Fonctionnalités avancées** : Drag & drop, filtres avancés, export
- 📊 **Analytics** : Suivi des performances et métriques
- 🚀 **Déploiement en production** : Mise en ligne de l'application finale

### **Concepts à maîtriser :**
- **Fonctionnalités avancées** : Drag & drop, filtres complexes, export
- **Analytics** : Google Analytics, métriques de performance
- **Monitoring** : Logs, alertes, surveillance en production
- **Maintenance** : Mises à jour, migrations, support

### **Prérequis validés :**
- ✅ Tests complets et automatisés
- ✅ Performance optimisée
- ✅ Déploiement automatisé
- ✅ Code de qualité professionnelle
- ✅ Documentation complète

---

*🎯 **Prêt pour la Partie 5 !** Votre application a maintenant une base solide avec des tests, des optimisations de performance et un déploiement automatisé. Dans la Partie 5, nous créerons le projet final avec des fonctionnalités avancées.*
