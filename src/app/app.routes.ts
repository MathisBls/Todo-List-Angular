import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { TODOS_ROUTES } from './features/todos/todos.routes';

export const routes: Routes = [
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  {
    path: 'admin',
    children: ADMIN_ROUTES,
  },
  {
    path: 'todos',
    children: TODOS_ROUTES,
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
