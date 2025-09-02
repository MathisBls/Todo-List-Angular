import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../../features/auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = signal<User[]>([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      createdAt: new Date('2024-01-02'),
    },
  ]);

  private currentUser = signal<User | null>(null);

  constructor() {
    this.restoreSession();
  }

  getCurrentUserSignal() {
    return this.currentUser.asReadonly();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private saveToLocalStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
  }

  private removeFromLocalStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }

  private restoreSession(): void {
    const savedUser = localStorage.getItem('currentUser');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (savedUser && isAuthenticated === 'true') {
      try {
        const user = JSON.parse(savedUser);
        this.currentUser.set(user);
        console.log('✅ Session restaurée pour:', user.email);
      } catch (error) {
        console.error('❌ Erreur lors de la restauration de session:', error);
        this.removeFromLocalStorage();
      }
    }
  }

  async login(
    credentials: LoginRequest
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log('🔄 Service: Tentative de connexion...', credentials.email);
    await this.delay(500);

    const user = this.users().find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      this.currentUser.set(user);
      this.saveToLocalStorage(user);
      console.log('✅ Service: Connexion réussie pour:', user.email);
      return { success: true, user };
    } else {
      console.log('❌ Service: Échec de connexion pour:', credentials.email);
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }
  }

  async register(
    userData: RegisterRequest
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    console.log("🔄 Service: Tentative d'inscription...", userData.email);
    await this.delay(600);

    if (this.users().some(u => u.email === userData.email)) {
      console.log('❌ Service: Email déjà utilisé:', userData.email);
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

    if (userData.password !== userData.confirmPassword) {
      console.log('❌ Service: Mots de passe différents');
      return { success: false, error: 'Les mots de passe ne correspondent pas' };
    }

    const newUser: User = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      createdAt: new Date(),
    };

    this.users.update(users => [...users, newUser]);
    this.currentUser.set(newUser);
    this.saveToLocalStorage(newUser);

    console.log('✅ Service: Inscription réussie pour:', newUser.email);
    return { success: true, user: newUser };
  }

  async logout(): Promise<void> {
    console.log('🔄 Service: Déconnexion...');
    await this.delay(200);
    this.currentUser.set(null);
    this.removeFromLocalStorage();
    console.log('✅ Service: Déconnexion réussie');
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  async getAllUsers(): Promise<User[]> {
    console.log('🔄 Service: Récupération de tous les utilisateurs...');
    await this.delay(400);

    if (!this.isAdmin()) {
      throw new Error('Accès non autorisé');
    }

    console.log('✅ Service: Utilisateurs récupérés');
    return this.users().map(user => ({
      ...user,
      password: '***',
    }));
  }

  async deleteUser(userId: number): Promise<void> {
    console.log('🔄 Service: Suppression utilisateur...', userId);
    await this.delay(300);

    if (!this.isAdmin()) {
      throw new Error('Accès non autorisé');
    }

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      throw new Error('Impossible de supprimer votre propre compte');
    }

    this.users.update(users => users.filter(user => user.id !== userId));
    console.log('✅ Service: Utilisateur supprimé');
  }
}
