import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, CreateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = signal<Todo[]>([]);

  constructor() {
    this.restoreTodos();

    effect(() => {
      const todos = this.todos();
      console.log('🔄 Effect: Todos mis à jour, sauvegarde automatique...', todos.length);
      localStorage.setItem('todos', JSON.stringify(todos));
    });
  }

  private restoreTodos(): void {
    try {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const todos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
        this.todos.set(todos);
        console.log('✅ Todos restaurés depuis localStorage:', todos.length);
      } else {
        this.todos.set([
          {
            id: 1,
            title: 'Apprendre Angular',
            description: "Étudier les fondamentaux d'Angular 20+",
            status: 'todo',
            priority: 'high',
            duration: 480, // 8 heures
            createdBy: 1,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
          },
          {
            id: 2,
            title: 'Créer un projet',
            description: 'Développer une application TodoList',
            status: 'in-progress',
            priority: 'medium',
            duration: 240, // 4 heures
            createdBy: 1,
            createdAt: new Date('2024-01-14'),
            updatedAt: new Date('2024-01-16'),
          },
          {
            id: 3,
            title: "Configurer l'environnement",
            description: 'Installer Node.js, Angular CLI et configurer VS Code',
            status: 'done',
            priority: 'high',
            duration: 90, // 1h30
            createdBy: 1,
            createdAt: new Date('2024-01-13'),
            updatedAt: new Date('2024-01-14'),
          },
        ]);
        console.log('✅ Todos par défaut chargés');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la restauration des todos:', error);
      this.todos.set([]);
    }
  }

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
    console.log("🔄 Service: Création d'un nouveau todo...", todoData);
    await this.delay(400);

    const newTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description || '',
      status: 'todo',
      priority: todoData.priority,
      duration: todoData.duration,
      assignedTo: todoData.assignedTo,
      createdBy: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
      createdAt: new Date(),
      updatedAt: new Date(),
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
            updatedAt: new Date(),
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

  // Computed signals pour les filtres
  public completedTodos = computed(() => this.todos().filter(todo => todo.status === 'done'));

  public pendingTodos = computed(() => this.todos().filter(todo => todo.status === 'todo'));

  public inProgressTodos = computed(() =>
    this.todos().filter(todo => todo.status === 'in-progress')
  );

  public highPriorityTodos = computed(() => this.todos().filter(todo => todo.priority === 'high'));

  public todoStats = computed(() => ({
    total: this.todos().length,
    completed: this.completedTodos().length,
    inProgress: this.inProgressTodos().length,
    pending: this.pendingTodos().length,
    highPriority: this.highPriorityTodos().length,
    completionRate:
      this.todos().length > 0 ? (this.completedTodos().length / this.todos().length) * 100 : 0,
  }));

  // Méthodes utilitaires (gardées pour compatibilité)
  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter(todo => todo.status === status);
  }

  getTodosByPriority(priority: Todo['priority']): Todo[] {
    return this.todos().filter(todo => todo.priority === priority);
  }
}
