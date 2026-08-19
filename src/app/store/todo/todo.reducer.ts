import { createFeature, createReducer, on } from '@ngrx/store';
import { Todo, TodoFilter } from '../../models/todo.model';
import { TodoActions } from './todo.actions';

export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
  loading: true,
  error: null,
};

/**
 * `createFeature` bundles the reducer with auto-generated selectors
 * (selectTodos, selectFilter, ...) scoped under the `todo` feature key.
 * The reducer itself is a pure function: (state, action) => new state.
 */
export const todoFeature = createFeature({
  name: 'todo',
  reducer: createReducer(
    initialState,

    on(TodoActions.init, (state) => ({ ...state, loading: true, error: null })),

    on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
      ...state,
      todos,
      loading: false,
    })),

    on(TodoActions.loadTodosFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(TodoActions.addTodo, (state, { todo }) => ({
      ...state,
      todos: [todo, ...state.todos],
    })),

    on(TodoActions.removeTodo, (state, { id }) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

    on(TodoActions.toggleTodo, (state, { id }) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),

    on(TodoActions.clearCompleted, (state) => ({
      ...state,
      todos: state.todos.filter((todo) => !todo.completed),
    })),

    on(TodoActions.setFilter, (state, { filter }) => ({ ...state, filter })),
  ),
});

export const {
  name: todoFeatureKey,
  reducer: todoReducer,
  selectTodos,
  selectFilter,
  selectLoading,
  selectError,
} = todoFeature;
