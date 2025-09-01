// src/app/features/todos/todos.routes.ts
import { Routes } from '@angular/router';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/todo-list/todo-list.component').then(m => m.TodoListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/todo-detail/todo-detail.component').then(m => m.TodoDetailComponent),
  },
];
