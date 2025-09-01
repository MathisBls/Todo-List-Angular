import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../features/auth/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styles: [],
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  users = signal<User[]>([]);

  async ngOnInit() {
    // Vérifier que l'utilisateur est admin
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/todos']);
      return;
    }

    // Charger les utilisateurs
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      const users = await this.authService.getAllUsers();
      this.users.set(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  }

  goBack() {
    this.router.navigate(['/todos']);
  }
}
