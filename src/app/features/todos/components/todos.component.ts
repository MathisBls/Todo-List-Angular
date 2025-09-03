import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { DurationPipe } from '../../../shared/pipes/duration.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { ErrorService } from '../../../shared/services/error.service';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityPipe, DurationPipe, HighlightDirective],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ Optimisation
})
export class TodosComponent implements OnInit {
  protected readonly todoService = inject(TodoService);
  private readonly errorService = inject(ErrorService);

  protected todos = signal<Todo[]>([]);
  protected loading = signal(true);
  protected addingTodo = signal(false);

  protected newTodo = {
    title: '',
    description: '',
    priority: 'medium' as const,
    duration: 60,
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
          duration: this.newTodo.duration,
        });

        await this.loadTodos();
        this.errorService.showInfo('Todo ajouté avec succès !');

        this.newTodo.title = '';
        this.newTodo.description = '';
        this.newTodo.duration = 60;
      } catch (error) {
        console.error("Erreur lors de l'ajout du todo:", error);
        this.errorService.showError("Erreur lors de l'ajout du todo");
      } finally {
        this.addingTodo.set(false);
      }
    }
  }

  protected async updateStatus(id: number, status: Todo['status']): Promise<void> {
    try {
      await this.todoService.updateTodo(id, { status });
      await this.loadTodos();
      this.errorService.showInfo(`Todo mis à jour vers ${status}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      this.errorService.showError('Erreur lors de la mise à jour du todo');
    }
  }

  protected async deleteTodo(id: number): Promise<void> {
    try {
      await this.todoService.deleteTodo(id);
      await this.loadTodos();
      this.errorService.showInfo('Todo supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      this.errorService.showError('Erreur lors de la suppression du todo');
    }
  }

  protected getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter(todo => todo.status === status);
  }

  // ⚡ Optimisation : TrackBy pour éviter la recréation des éléments
  protected trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}
