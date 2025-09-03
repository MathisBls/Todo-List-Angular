import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TodoService } from '../../../../features/todos/services/todo.service';
import { User } from '../../../../features/auth/models/user.model';
import { Todo } from '../../../../features/todos/models/todo.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly todoService = inject(TodoService);
  private readonly router = inject(Router);

  protected activeTab = signal<'users' | 'tickets'>('users');
  protected users = signal<User[]>([]);
  protected todos = signal<Todo[]>([]);
  protected loading = signal(false);

  async ngOnInit(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/todos']);
      return;
    }

    await this.loadData();
  }

  private async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      await Promise.all([this.loadUsers(), this.loadTodos()]);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadUsers(): Promise<void> {
    try {
      const users = await this.authService.getAllUsers();
      this.users.set(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  }

  private async loadTodos(): Promise<void> {
    try {
      const todos = await this.todoService.getAllTodos();
      this.todos.set(todos);
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
    }
  }

  protected async deleteUser(userId: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await this.authService.deleteUser(userId);
        await this.loadUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  protected async deleteTodo(todoId: number): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      try {
        await this.todoService.deleteTodo(todoId);
        await this.loadTodos();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  protected assignTodo(todo: Todo): void {
    // TODO: Implémenter la logique d'assignation
    console.warn('Assigner le ticket:', todo);
  }

  protected goBack(): void {
    this.router.navigate(['/todos']);
  }
}
