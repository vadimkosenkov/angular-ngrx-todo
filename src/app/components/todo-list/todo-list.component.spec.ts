import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Todo } from '../../models/todo.model';
import { makeTodo } from '../../testing/todo.fixtures';
import { TodoActions } from '../../store/todo/todo.actions';
import {
  selectFilter,
  selectFilteredTodos,
  selectLoading,
  selectTodoCounts,
  TodoCounts,
} from '../../store/todo/todo.selectors';
import { TodoListComponent } from './todo-list.component';

const zeroCounts: TodoCounts = { total: 0, active: 0, completed: 0 };

describe('TodoListComponent', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectFilteredTodos, value: [] },
            { selector: selectTodoCounts, value: zeroCounts },
            { selector: selectFilter, value: 'all' },
            { selector: selectLoading, value: false },
          ],
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    // `MockStore.overrideSelector` patches the shared selector functions
    // themselves, not just this store instance — without resetting, an
    // override here would leak into other spec files that reuse the same
    // selectors (e.g. todo.selectors.spec.ts).
    store.resetSelectors();
  });

  it('should show a validation error and not dispatch when submitting an empty title', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(TodoListComponent);
    fixture.detectChanges();

    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Task title cannot be empty.',
    );
  });

  it('should show a validation error when the title is only whitespace', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(TodoListComponent);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '   ';
    input.dispatchEvent(new Event('input'));

    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch addTodo with the trimmed title and clear the input on submit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(TodoListComponent);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '  Buy milk  ';
    input.dispatchEvent(new Event('input'));
    // Flush this change so Angular's tracked binding value matches the DOM
    // before the later reset to '' — otherwise the reset looks like a no-op
    // change (both reads happen to be '') and the DOM write gets skipped.
    fixture.detectChanges();

    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const dispatched = dispatchSpy.calls.mostRecent().args[0] as unknown as { todo: Todo };
    expect(dispatched.todo.title).toBe('Buy milk');
    expect(input.value).toBe('');
  });

  it('should dispatch setFilter when a filter tab is clicked', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(TodoListComponent);
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    const activeTab = buttons.find((btn) => btn.textContent?.trim() === 'Active');
    activeTab?.click();

    expect(dispatchSpy).toHaveBeenCalledWith(TodoActions.setFilter({ filter: 'active' }));
  });

  it('should show the empty-state placeholder and hide the counters row when there are no todos', () => {
    const fixture = TestBed.createComponent(TodoListComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Your list is empty. Add your first task above.');
    expect(text).not.toContain('total');
  });

  it('should render one app-todo-item per todo and show the counters row', () => {
    store.overrideSelector(selectFilteredTodos, [makeTodo({ id: '1' }), makeTodo({ id: '2' })]);
    store.overrideSelector(selectTodoCounts, { total: 2, active: 2, completed: 0 });
    store.refreshState();

    const fixture = TestBed.createComponent(TodoListComponent);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('app-todo-item');
    expect(items.length).toBe(2);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('2 total');
  });

  it('should dispatch clearCompleted when "Clear completed" is clicked', () => {
    store.overrideSelector(selectFilteredTodos, [makeTodo({ completed: true })]);
    store.overrideSelector(selectTodoCounts, { total: 1, active: 0, completed: 1 });
    store.refreshState();

    const dispatchSpy = spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(TodoListComponent);
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    const clearButton = buttons.find((btn) => btn.textContent?.trim() === 'Clear completed');
    clearButton?.click();

    expect(dispatchSpy).toHaveBeenCalledWith(TodoActions.clearCompleted());
  });
});
