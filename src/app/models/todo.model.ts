export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

/** Shape returned by https://jsonplaceholder.typicode.com/todos */
export interface RemoteTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
