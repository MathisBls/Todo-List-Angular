import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  private readonly todoService = inject(TodoService);

  protected todos = signal<Todo[]>([]);
  protected loading = signal(true);
  protected addingTodo = signal(false);

  protected newTodo = {
    title: '',
    description: '',
    priority: 'medium' as const,
  };

  async ngOnInit(): Promise<void> {
    await this.loadTodos();
  }

  protected async loadTodos(): Promise<void> {
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

  protected async addTodo(): Promise<void> {
    if (this.newTodo.title.trim()) {
      try {
        this.addingTodo.set(true);
        await this.todoService.createTodo({
          title: this.newTodo.title,
          description: this.newTodo.description,
          priority: this.newTodo.priority,
        });

        await this.loadTodos();

        this.newTodo.title = '';
        this.newTodo.description = '';
      } catch (error) {
        console.error("Erreur lors de l'ajout du todo:", error);
      } finally {
        this.addingTodo.set(false);
      }
    }
  }

  protected async updateStatus(id: number, status: Todo['status']): Promise<void> {
    try {
      await this.todoService.updateTodo(id, { status });
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  }

  protected async deleteTodo(id: number): Promise<void> {
    try {
      await this.todoService.deleteTodo(id);
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  protected getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter(todo => todo.status === status);
  }
}
