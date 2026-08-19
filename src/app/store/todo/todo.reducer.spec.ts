import { TodoActions } from './todo.actions';
import { todoReducer, TodoState } from './todo.reducer';
import { makeTodo } from '../../testing/todo.fixtures';

describe('todoReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const state = todoReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({ todos: [], filter: 'all', loading: true, error: null });
  });

  it('should set loading and clear the error on init', () => {
    const state: TodoState = {
      todos: [],
      filter: 'all',
      loading: false,
      error: 'previous error',
    };

    const result = todoReducer(state, TodoActions.init());

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should replace the todo list and clear loading on loadTodosSuccess', () => {
    const state: TodoState = { todos: [], filter: 'all', loading: true, error: null };
    const todos = [makeTodo()];

    const result = todoReducer(state, TodoActions.loadTodosSuccess({ todos }));

    expect(result.todos).toBe(todos);
    expect(result.loading).toBe(false);
  });

  it('should store the error and clear loading on loadTodosFailure', () => {
    const state: TodoState = { todos: [], filter: 'all', loading: true, error: null };

    const result = todoReducer(state, TodoActions.loadTodosFailure({ error: 'network error' }));

    expect(result.loading).toBe(false);
    expect(result.error).toBe('network error');
  });

  it('should prepend a new todo so the newest task appears first', () => {
    const existing = makeTodo({ id: 'existing' });
    const state: TodoState = { todos: [existing], filter: 'all', loading: false, error: null };
    const newTodo = makeTodo({ id: 'new' });

    const result = todoReducer(state, TodoActions.addTodo({ todo: newTodo }));

    expect(result.todos).toEqual([newTodo, existing]);
  });

  it('should remove only the todo matching the given id', () => {
    const keep = makeTodo({ id: 'keep' });
    const remove = makeTodo({ id: 'remove' });
    const state: TodoState = {
      todos: [keep, remove],
      filter: 'all',
      loading: false,
      error: null,
    };

    const result = todoReducer(state, TodoActions.removeTodo({ id: 'remove' }));

    expect(result.todos).toEqual([keep]);
  });

  it('should flip the completed flag of the matching todo only', () => {
    const target = makeTodo({ id: 'target', completed: false });
    const other = makeTodo({ id: 'other', completed: false });
    const state: TodoState = {
      todos: [target, other],
      filter: 'all',
      loading: false,
      error: null,
    };

    const result = todoReducer(state, TodoActions.toggleTodo({ id: 'target' }));

    expect(result.todos.find((t) => t.id === 'target')?.completed).toBe(true);
    expect(result.todos.find((t) => t.id === 'other')?.completed).toBe(false);
  });

  it('should toggle a completed todo back to incomplete', () => {
    const target = makeTodo({ id: 'target', completed: true });
    const state: TodoState = { todos: [target], filter: 'all', loading: false, error: null };

    const result = todoReducer(state, TodoActions.toggleTodo({ id: 'target' }));

    expect(result.todos[0].completed).toBe(false);
  });

  it('should remove all completed todos on clearCompleted', () => {
    const active = makeTodo({ id: 'active', completed: false });
    const done = makeTodo({ id: 'done', completed: true });
    const state: TodoState = {
      todos: [active, done],
      filter: 'all',
      loading: false,
      error: null,
    };

    const result = todoReducer(state, TodoActions.clearCompleted());

    expect(result.todos).toEqual([active]);
  });

  it('should update the active filter on setFilter', () => {
    const state: TodoState = { todos: [], filter: 'all', loading: false, error: null };

    const result = todoReducer(state, TodoActions.setFilter({ filter: 'completed' }));

    expect(result.filter).toBe('completed');
  });
});
