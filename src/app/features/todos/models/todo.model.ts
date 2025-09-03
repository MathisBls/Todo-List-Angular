export interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  duration?: number; // Durée estimée en minutes
  assignedTo?: number; // ID de l'utilisateur assigné
  createdBy: number; // ID de l'utilisateur créateur
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  duration?: number; // Durée estimée en minutes
  assignedTo?: number;
}
