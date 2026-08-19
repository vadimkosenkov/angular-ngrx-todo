import { Todo } from '../../models/todo.model';
import { makeTodo } from '../../testing/todo.fixtures';
import { TodoState } from './todo.reducer';
import { selectFilteredTodos, selectTodoCounts } from './todo.selectors';

function makeState(todos: Todo[], filter: TodoState['filter'] = 'all'): { todo: TodoState } {
  return { todo: { todos, filter, loading: false, error: null } };
}

describe('todo selectors', () => {
  const active = makeTodo({ id: 'active', completed: false });
  const completed = makeTodo({ id: 'completed', completed: true });

  describe('selectFilteredTodos', () => {
    it('should return every todo when the filter is "all"', () => {
      const state = makeState([active, completed], 'all');

      expect(selectFilteredTodos(state)).toEqual([active, completed]);
    });

    it('should return only incomplete todos when the filter is "active"', () => {
      const state = makeState([active, completed], 'active');

      expect(selectFilteredTodos(state)).toEqual([active]);
    });

    it('should return only completed todos when the filter is "completed"', () => {
      const state = makeState([active, completed], 'completed');

      expect(selectFilteredTodos(state)).toEqual([completed]);
    });
  });

  describe('selectTodoCounts', () => {
    it('should count total, active, and completed todos independent of the filter', () => {
      const state = makeState([active, completed], 'completed');

      expect(selectTodoCounts(state)).toEqual({ total: 2, active: 1, completed: 1 });
    });

    it('should return zero counts for an empty list', () => {
      const state = makeState([]);

      expect(selectTodoCounts(state)).toEqual({ total: 0, active: 0, completed: 0 });
    });
  });
});
