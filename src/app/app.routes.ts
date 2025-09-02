import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { TODOS_ROUTES } from './features/todos/todos.routes';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], // Protection admin
    children: ADMIN_ROUTES,
  },
  {
    path: 'todos',
    canActivate: [authGuard], // Protection par authentification
    children: TODOS_ROUTES,
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
