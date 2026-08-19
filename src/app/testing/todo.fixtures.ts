import { Todo } from '../models/todo.model';

/** Shared test fixture builder so specs don't each redefine the same shape. */
export function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 'todo-1',
    title: 'Buy milk',
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}
