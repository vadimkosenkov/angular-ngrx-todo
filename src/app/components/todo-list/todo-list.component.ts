import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClipboardDocumentList, heroPlus } from '@ng-icons/heroicons/outline';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo, TodoFilter } from '../../models/todo.model';
import { TodoActions } from '../../store/todo/todo.actions';
import { selectFilter, selectFilteredTodos, selectLoading, selectTodoCounts } from '../../store/todo/todo.selectors';

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

@Component({
  selector: 'app-todo-list',
  imports: [TodoItemComponent, NgIcon],
  providers: [provideIcons({ heroPlus, heroClipboardDocumentList })],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent {
  private readonly store = inject(Store);

  // `selectSignal` bridges an NgRx selector directly into a signal, no async pipe needed.
  protected readonly todos = this.store.selectSignal(selectFilteredTodos);
  protected readonly counts = this.store.selectSignal(selectTodoCounts);
  protected readonly filter = this.store.selectSignal(selectFilter);
  protected readonly loading = this.store.selectSignal(selectLoading);

  protected readonly filters = FILTERS;
  protected readonly newTitle = signal('');
  protected readonly validationError = signal<string | null>(null);

  protected addTodo(): void {
    const title = this.newTitle().trim();
    if (!title) {
      this.validationError.set('Task title cannot be empty.');
      return;
    }

    const todo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.store.dispatch(TodoActions.addTodo({ todo }));
    this.newTitle.set('');
    this.validationError.set(null);
  }

  protected onTitleInput(value: string): void {
    this.newTitle.set(value);
    if (this.validationError() && value.trim()) {
      this.validationError.set(null);
    }
  }

  protected toggleTodo(id: string): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  protected removeTodo(id: string): void {
    this.store.dispatch(TodoActions.removeTodo({ id }));
  }

  protected setFilter(filter: TodoFilter): void {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }

  protected clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }
}
