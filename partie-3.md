# Partie 3 : Gestion d'État Avancée et Composants Personnalisés

## 🎯 Objectifs de la Partie 3

À la fin de cette partie, vous serez capable de :
- ✅ Maîtriser la gestion d'état avec Signals (avantages vs anciennes méthodes)
- ✅ Créer des pipes personnalisés pour la transformation de données
- ✅ Développer des directives personnalisées
- ✅ Implémenter une communication avancée entre composants
- ✅ Optimiser les performances avec les nouvelles fonctionnalités Angular 20+

---

## 🔄 Étape 3.1 : Gestion d'État Avancée avec Signals

### **Pourquoi les Signals sont révolutionnaires ?**

Les Signals d'Angular 20+ représentent une **révolution** dans la gestion d'état par rapport aux anciennes méthodes :

#### **🔄 Comparaison avec les anciennes méthodes :**

**❌ Ancienne méthode (BehaviorSubject/Observable) :**
```typescript
// Service avec BehaviorSubject
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();

  addTodo(todo: Todo) {
    const currentTodos = this.todosSubject.value;
    this.todosSubject.next([...currentTodos, todo]);
  }
}

// Composant avec Observable
export class TodoListComponent {
  todos$ = this.todoService.todos$;

  constructor(private todoService: TodoService) {}

  addTodo(todo: Todo) {
    this.todoService.addTodo(todo);
  }
}
```

**✅ Nouvelle méthode (Signals) :**
```typescript
// Service avec Signals
export class TodoService {
  private todos = signal<Todo[]>([]);
  public todos = this.todos.asReadonly();

  addTodo(todo: Todo) {
    this.todos.update(todos => [...todos, todo]);
  }
}

// Composant avec Signals
export class TodoListComponent {
  todos = this.todoService.todos;

  constructor(private todoService: TodoService) {}

  addTodo(todo: Todo) {
    this.todoService.addTodo(todo);
  }
}
```

#### **🚀 Avantages des Signals :**

1. **⚡ Performance supérieure** :
   - Détection de changements granulaire
   - Pas de cycle de détection complet
   - Mise à jour uniquement des composants concernés

2. **🧠 Simplicité d'utilisation** :
   - Pas de `subscribe()`/`unsubscribe()`
   - Pas de gestion de la mémoire
   - Syntaxe plus intuitive

3. **🔒 Type safety** :
   - Typage strict par défaut
   - Moins d'erreurs runtime
   - Meilleur support IDE

4. **🔄 Réactivité automatique** :
   - Mise à jour automatique du template
   - Pas d'`async` pipe nécessaire
   - Gestion automatique du cycle de vie

### **Implémentation des Signals avancés**

#### **1. Signal computed (dérivé)
```typescript
export class TodoService {
  private todos = signal<Todo[]>([]);
  
  // Signal computed - se recalcule automatiquement
  public completedTodos = computed(() => 
    this.todos().filter(todo => todo.status === 'done')
  );
  
  public pendingTodos = computed(() => 
    this.todos().filter(todo => todo.status === 'todo')
  );

  public inProgressTodos = computed(() => 
    this.todos().filter(todo => todo.status === 'in-progress')
  );
  
  public highPriorityTodos = computed(() => 
    this.todos().filter(todo => todo.priority === 'high')
  );
  
  public todoStats = computed(() => ({
    total: this.todos().length,
    completed: this.completedTodos().length,
    inProgress: this.inProgressTodos().length,
    pending: this.pendingTodos().length,
    highPriority: this.highPriorityTodos().length,
    completionRate: this.todos().length > 0 
      ? (this.completedTodos().length / this.todos().length) * 100 
      : 0
  }));
}
```

**🔧 Correction importante :** Nous avons séparé les computed signals par statut exact pour éviter les doublons entre les colonnes Kanban.

#### **2. Signal writable avec validation**
```typescript
export class UserService {
  private currentUser = signal<User | null>(null);
  
  // Signal avec validation
  public isAdmin = computed(() => 
    this.currentUser()?.role === 'admin'
  );
  
  public canEditTodos = computed(() => 
    this.currentUser() && (this.isAdmin() || this.currentUser()?.role === 'user')
  );
}
```

#### **3. Signal avec effets**
```typescript
export class TodoService {
  private todos = signal<Todo[]>([]);
  
  constructor() {
    // Effet qui se déclenche automatiquement
    effect(() => {
      const todos = this.todos();
      console.warn(`Todos mis à jour: ${todos.length} todos`);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('todos', JSON.stringify(todos));
    });
  }
}
```

---

## 🎨 Étape 3.2 : Pipes Personnalisés

### **Pourquoi créer des pipes personnalisés ?**

Les pipes permettent de **transformer les données** dans le template sans modifier la logique du composant. Ils sont :
- **Réutilisables** : Un pipe peut être utilisé dans plusieurs composants
- **Performants** : Mise en cache automatique des résultats
- **Testables** : Logique pure, facile à tester
- **Maintenables** : Séparation claire entre logique et présentation

### **Création de pipes personnalisés**

#### **1. Pipe de formatage de priorité - IMPLÉMENTÉ**
```typescript
// src/app/shared/pipes/priority.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority',
  standalone: true
})
export class PriorityPipe implements PipeTransform {
  transform(priority: 'low' | 'medium' | 'high'): string {
    const priorityMap = {
      low: 'Faible',
      medium: 'Moyenne',
      high: 'Haute'
    };
    
    return priorityMap[priority] || priority;
  }
}
```

#### **2. Pipe de formatage de durée - IMPLÉMENTÉ**
```typescript
// src/app/shared/pipes/duration.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  }
}
```

### **Utilisation des pipes dans les templates**
```html
<!-- Formatage de priorité -->
<span 
  class="px-2 py-1 text-xs font-semibold rounded-full"
  [class.bg-red-100]="todo.priority === 'high'"
  [class.text-red-800]="todo.priority === 'high'"
  [class.bg-yellow-100]="todo.priority === 'medium'"
  [class.text-yellow-800]="todo.priority === 'medium'"
  [class.bg-green-100]="todo.priority === 'low'"
  [class.text-green-800]="todo.priority === 'low'"
>
  {{ todo.priority | priority }}
</span>
```

---

## 🎛️ Étape 3.3 : Directives Personnalisées

### **Pourquoi créer des directives personnalisées ?**

Les directives permettent d'**étendre le comportement HTML** et de créer des **composants réutilisables** :
- **Réutilisabilité** : Une directive peut être appliquée à n'importe quel élément
- **Encapsulation** : Logique métier isolée
- **Performance** : Moins de composants = moins de surcharge
- **Flexibilité** : Comportement dynamique selon les paramètres

### **Création de directives personnalisées**

#### **1. Directive de highlight - IMPLÉMENTÉ**
```typescript
// src/app/shared/directives/highlight.directive.ts
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: string = 'yellow';
  @Input() appHighlightDelay: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.renderer.setStyle(
        this.el.nativeElement,
        'background-color',
        this.appHighlight
      );
    }, this.appHighlightDelay);
  }
}
```

### **Utilisation des directives dans les templates**
```html
<!-- Highlight avec priorité -->
<div 
  class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400"
  [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
  [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
>
  <!-- Contenu du todo -->
</div>
```

---

## 🔗 Étape 3.4 : Communication Avancée entre Composants

### **Patterns de communication**

#### **1. Service partagé avec Signals - IMPLÉMENTÉ**
```typescript
// src/app/shared/services/error.service.ts
import { Injectable, signal } from '@angular/core';

export interface ErrorNotification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
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
      timestamp: new Date()
    };

    this.errors.update(errors => [...errors, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeError(notification.id);
    }, 5000);
  }

  removeError(id: string) {
    this.errors.update(errors => errors.filter(error => error.id !== id));
  }

  clearAll() {
    this.errors.set([]);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
```

#### **2. Composant de notification global - IMPLÉMENTÉ**
```typescript
// src/app/shared/components/notifications/notifications.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (notification of errorService.errors$(); track notification.id) {
        <div 
          class="w-fit max-w-md p-4 rounded-lg shadow-lg text-white flex items-center justify-between"
          [class]="{
            'bg-red-500': notification.type === 'error',
            'bg-yellow-500': notification.type === 'warning',
            'bg-blue-500': notification.type === 'info'
          }"
        >
          <div class="flex items-center space-x-2">
            <!-- Icône selon le type -->
            @if (notification.type === 'error') {
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            }
            @if (notification.type === 'warning') {
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            }
            @if (notification.type === 'info') {
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
            }
            <span>{{ notification.message }}</span>
          </div>
          <button 
            (click)="errorService.removeError(notification.id)"
            class="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      }
    </div>
  `
})
export class NotificationsComponent {
  errorService = inject(ErrorService);
}
```

---

## 🎯 Étape 3.5 : Amélioration du composant TodoList

### **Intégration des Signals avancés**

#### **1. Utilisation des computed signals dans le template**
```typescript
// src/app/features/todos/components/todo-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../services/todo.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, PriorityPipe, HighlightDirective],
  template: `
    <!-- Dashboard des statistiques -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Statistiques en temps réel</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Total</h3>
          <p class="text-2xl font-bold text-gray-900">{{ todoService.todoStats().total }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Complétés</h3>
          <p class="text-2xl font-bold text-green-600">{{ todoService.todoStats().completed }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">En cours</h3>
          <p class="text-2xl font-bold text-blue-600">{{ todoService.todoStats().inProgress }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Priorité haute</h3>
          <p class="text-2xl font-bold text-red-600">{{ todoService.todoStats().highPriority }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Taux de complétion</h3>
          <p class="text-2xl font-bold text-purple-600">{{ todoService.todoStats().completionRate | number:'1.0-0' }}%</p>
        </div>
      </div>
    </div>

    <!-- Colonnes Kanban -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- À faire -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          À faire
          <span class="text-sm text-gray-500">({{ todoService.pendingTodos().length }})</span>
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.pendingTodos(); track todo.id) {
            <div 
              class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-400"
              [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
              [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">{{ todo.title }}</h4>
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  [class.bg-red-100]="todo.priority === 'high'"
                  [class.text-red-800]="todo.priority === 'high'"
                  [class.bg-yellow-100]="todo.priority === 'medium'"
                  [class.text-yellow-800]="todo.priority === 'medium'"
                  [class.bg-green-100]="todo.priority === 'low'"
                  [class.text-green-800]="todo.priority === 'low'"
                >
                  {{ todo.priority | priority }}
                </span>
              </div>
              @if (todo.description) {
                <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
              }
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Créé le {{ todo.createdAt | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- En cours -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          En cours
          <span class="text-sm text-gray-500">({{ todoService.inProgressTodos().length }})</span>
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.inProgressTodos(); track todo.id) {
            <div 
              class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400"
              [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
              [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">{{ todo.title }}</h4>
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  [class.bg-red-100]="todo.priority === 'high'"
                  [class.text-red-800]="todo.priority === 'high'"
                  [class.bg-yellow-100]="todo.priority === 'medium'"
                  [class.text-yellow-800]="todo.priority === 'medium'"
                  [class.bg-green-100]="todo.priority === 'low'"
                  [class.text-green-800]="todo.priority === 'low'"
                >
                  {{ todo.priority | priority }}
                </span>
              </div>
              @if (todo.description) {
                <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
              }
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Mis à jour le {{ todo.updatedAt | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Terminé -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Terminé
          <span class="text-sm text-gray-500">({{ todoService.completedTodos().length }})</span>
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.completedTodos(); track todo.id) {
            <div 
              class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400"
              [appHighlight]="todo.priority === 'high' ? 'rgba(34, 197, 94, 0.1)' : 'transparent'"
              [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900 line-through">{{ todo.title }}</h4>
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  [class.bg-red-100]="todo.priority === 'high'"
                  [class.text-red-800]="todo.priority === 'high'"
                  [class.bg-yellow-100]="todo.priority === 'medium'"
                  [class.text-yellow-800]="todo.priority === 'medium'"
                  [class.bg-green-100]="todo.priority === 'low'"
                  [class.text-green-800]="todo.priority === 'low'"
                >
                  {{ todo.priority | priority }}
                </span>
              </div>
              @if (todo.description) {
                <p class="text-sm text-gray-600 mb-3 line-through">{{ todo.description }}</p>
              }
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>Terminé le {{ todo.updatedAt | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TodoListComponent {
  todoService = inject(TodoService);
}
```

**🔧 Corrections importantes apportées :**
- ✅ **Logique des computed signals** : Séparation par statut exact (`todo`, `in-progress`, `done`)
- ✅ **Suppression des doublons** : Chaque todo n'apparaît que dans sa colonne correspondante
- ✅ **Performance optimisée** : Utilisation directe des computed signals dans le template
- ✅ **Intégration des pipes et directives** : `PriorityPipe` et `HighlightDirective` intégrés

---

## 🧪 Tests des composants personnalisés

### **Test d'un pipe personnalisé**
```typescript
// src/app/shared/pipes/priority.pipe.spec.ts
import { PriorityPipe } from './priority.pipe';

describe('PriorityPipe', () => {
  let pipe: PriorityPipe;

  beforeEach(() => {
    pipe = new PriorityPipe();
  });

  it('should translate priority values correctly', () => {
    expect(pipe.transform('low')).toBe('Faible');
    expect(pipe.transform('medium')).toBe('Moyenne');
    expect(pipe.transform('high')).toBe('Haute');
  });

  it('should return original value for unknown priority', () => {
    expect(pipe.transform('unknown' as any)).toBe('unknown');
  });
});
```

### **Test d'une directive personnalisée**
```typescript
// src/app/shared/directives/highlight.directive.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';
import { Component } from '@angular/core';

@Component({
  template: '<div [appHighlight]="color" [appHighlightDelay]="delay">Test</div>'
})
class TestComponent {
  color = 'yellow';
  delay = 0;
}

describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightDirective, TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should apply highlight color', () => {
    component.color = 'red';
    fixture.detectChanges();
    
    const element = fixture.nativeElement.querySelector('div');
    expect(element.style.backgroundColor).toBe('red');
  });
});
```

---

## 🎯 État actuel de l'application

### **Fonctionnalités implémentées :**
- ✅ **Gestion d'état avancée** : Signals avec computed et effects
- ✅ **Pipes personnalisés** : Formatage et transformation de données
- ✅ **Directives personnalisées** : Comportements réutilisables
- ✅ **Communication avancée** : Service de notification global
- ✅ **Dashboard en temps réel** : Statistiques automatiques avec Signals
- ✅ **Colonnes Kanban optimisées** : Pas de doublons, filtrage précis

### **Concepts maîtrisés :**
- **Signals avancés** : computed, effects, writable signals
- **Pipes personnalisés** : Transformation de données dans les templates
- **Directives personnalisées** : Extension du comportement HTML
- **Communication entre composants** : Services partagés avec Signals
- **Performance optimisée** : Utilisation des computed signals pour éviter les recalculs

### **Corrections apportées :**
- 🔧 **Logique des computed signals** : Filtrage par statut exact pour éviter les doublons
- 🔧 **Performance** : Utilisation directe des computed signals dans le template
- 🔧 **Intégration** : Pipes et directives correctement intégrés

### **Prêt pour la Partie 4 :**
- ✅ Gestion d'état moderne avec Signals
- ✅ Composants réutilisables (pipes, directives)
- ✅ Communication avancée entre composants
- ✅ Performance optimisée avec computed signals

---

*💡 **Conseil du mentor :** Les Signals représentent l'avenir d'Angular. Prenez le temps de bien comprendre leurs avantages par rapport aux Observables. Les pipes et directives personnalisés vous permettront de créer des composants très réutilisables.*

*🔧 **Conseil qualité :** Créez toujours des tests pour vos pipes et directives personnalisés. Ils sont plus faciles à tester que les composants car ils ont moins de dépendances.*

---

## 🚀 Préparation pour la Partie 4

### **Objectifs de la Partie 4 :**
- 🧪 **Tests complets** : Tests unitaires, d'intégration et e2e
- ⚡ **Optimisations de performance** : OnPush strategy, trackBy, lazy loading
- 🚀 **Déploiement** : Build de production, déploiement sur différents plateformes
- 📋 **Bonnes pratiques** : Code review, refactoring, documentation

### **Concepts à maîtriser :**
- **Tests Angular** : Jasmine, TestBed, ComponentFixture
- **Performance** : ChangeDetectionStrategy, OnPush, trackBy
- **Build et déploiement** : Angular CLI, environnement de production
- **Bonnes pratiques** : Code review, refactoring, documentation

### **Prérequis validés :**
- ✅ Gestion d'état moderne avec Signals
- ✅ Composants personnalisés (pipes, directives)
- ✅ Communication avancée entre composants
- ✅ Architecture DDD solide
- ✅ Performance optimisée avec computed signals

---

*🎯 **Prêt pour la Partie 4 !** Votre application a maintenant une gestion d'état moderne et des composants personnalisés robustes. Dans la Partie 4, nous nous concentrerons sur les tests, les optimisations de performance et le déploiement.*
