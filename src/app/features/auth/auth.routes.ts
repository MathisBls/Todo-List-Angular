import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth.component';
import { RegisterComponent } from './components/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
