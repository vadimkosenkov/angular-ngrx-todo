import { createSelector } from '@ngrx/store';
import { selectFilter, selectLoading, selectTodos } from './todo.reducer';

export { selectTodos, selectFilter, selectLoading };

/** Todos narrowed down to the currently active filter (all/active/completed). */
export const selectFilteredTodos = createSelector(selectTodos, selectFilter, (todos, filter) => {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
});

export interface TodoCounts {
  total: number;
  active: number;
  completed: number;
}

/** Memoized so the counter row only recomputes when the todos array actually changes. */
export const selectTodoCounts = createSelector(selectTodos, (todos): TodoCounts => {
  const completed = todos.filter((todo) => todo.completed).length;
  return {
    total: todos.length,
    completed,
    active: todos.length - completed,
  };
});
