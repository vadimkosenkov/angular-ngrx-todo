import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { makeTodo } from '../../testing/todo.fixtures';
import { TodoActions } from './todo.actions';
import { TodoEffects } from './todo.effects';
import { selectTodos } from './todo.selectors';

describe('TodoEffects', () => {
  let actions$: Observable<unknown>;
  let effects: TodoEffects;
  let todoService: jasmine.SpyObj<TodoService>;
  let store: MockStore;

  beforeEach(() => {
    todoService = jasmine.createSpyObj<TodoService>('TodoService', [
      'loadFromStorage',
      'saveToStorage',
      'fetchSeedTodos',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TodoEffects,
        provideMockActions(() => actions$),
        provideMockStore({ selectors: [{ selector: selectTodos, value: [] }] }),
        { provide: TodoService, useValue: todoService },
      ],
    });

    effects = TestBed.inject(TodoEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    // See the matching comment in todo-list.component.spec.ts: selector
    // overrides are global to the selector function, not this store instance.
    store.resetSelectors();
  });

  describe('init$', () => {
    it('should hydrate from localStorage without calling the API when todos are stored', (done) => {
      const stored = [makeTodo()];
      todoService.loadFromStorage.and.returnValue(stored);

      actions$ = of(TodoActions.init());

      effects.init$.subscribe((action) => {
        expect(action).toEqual(TodoActions.loadTodosSuccess({ todos: stored }));
        expect(todoService.fetchSeedTodos).not.toHaveBeenCalled();
        done();
      });
    });

    it('should seed from the API when nothing is stored', (done) => {
      const seeded = [makeTodo({ id: 'seeded' })];
      todoService.loadFromStorage.and.returnValue(null);
      todoService.fetchSeedTodos.and.returnValue(of(seeded));

      actions$ = of(TodoActions.init());

      effects.init$.subscribe((action) => {
        expect(action).toEqual(TodoActions.loadTodosSuccess({ todos: seeded }));
        done();
      });
    });

    it('should dispatch loadTodosFailure when the seed request errors', (done) => {
      todoService.loadFromStorage.and.returnValue(null);
      todoService.fetchSeedTodos.and.returnValue(throwError(() => new Error('network down')));

      actions$ = of(TodoActions.init());

      effects.init$.subscribe((action) => {
        expect(action).toEqual(TodoActions.loadTodosFailure({ error: 'network down' }));
        done();
      });
    });
  });

  describe('persist$', () => {
    it('should save the current todos to storage whenever the list changes', (done) => {
      const todos = [makeTodo()];
      store.overrideSelector(selectTodos, todos);
      store.refreshState();

      actions$ = of(TodoActions.addTodo({ todo: todos[0] }));

      effects.persist$.subscribe(() => {
        expect(todoService.saveToStorage).toHaveBeenCalledWith(todos);
        done();
      });
    });

    it('should only persist for todo-mutating actions, not unrelated ones', (done) => {
      actions$ = of(TodoActions.setFilter({ filter: 'active' }));

      let emitted = false;
      effects.persist$.subscribe(() => (emitted = true));

      setTimeout(() => {
        expect(emitted).toBe(false);
        expect(todoService.saveToStorage).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
