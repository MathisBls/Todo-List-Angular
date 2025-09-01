import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/admin-dashboard/admin-dashboard.component').then(
        m => m.AdminDashboardComponent
      ),
  },
];
