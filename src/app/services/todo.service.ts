import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RemoteTodo, Todo } from '../models/todo.model';

const STORAGE_KEY = 'ngrx-todo-app.todos';
const SEED_API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';

/**
 * Handles persistence to localStorage and the one-time seed fetch
 * from the placeholder API. Kept dumb on purpose: all state decisions
 * (when to fetch, when to save) live in the NgRx effects, not here.
 */
@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);

  loadFromStorage(): Todo[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Todo[]) : null;
    } catch {
      return null;
    }
  }

  saveToStorage(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  fetchSeedTodos(): Observable<Todo[]> {
    return this.http.get<RemoteTodo[]>(SEED_API_URL).pipe(
      map((remoteTodos) =>
        remoteTodos.map((remote) => ({
          id: crypto.randomUUID(),
          title: remote.title,
          completed: remote.completed,
          createdAt: new Date().toISOString(),
        })),
      ),
    );
  }
}
