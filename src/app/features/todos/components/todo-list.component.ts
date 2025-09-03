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
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  todoService = inject(TodoService);
}
