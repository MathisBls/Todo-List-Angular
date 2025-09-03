// src/app/features/todos/todos.routes.ts
import { Routes } from '@angular/router';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/todos.component').then(m => m.TodosComponent),
  },
];
