import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { TodoActions } from './todo.actions';
import { selectTodos } from './todo.selectors';

@Injectable()
export class TodoEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly todoService = inject(TodoService);

  /**
   * On app start: hydrate from localStorage if we have saved todos,
   * otherwise seed the list from the placeholder API so the app never
   * opens empty on a first run.
   */
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.init),
      switchMap(() => {
        const stored = this.todoService.loadFromStorage();
        if (stored) {
          return of(TodoActions.loadTodosSuccess({ todos: stored }));
        }

        return this.todoService.fetchSeedTodos().pipe(
          map((todos) => TodoActions.loadTodosSuccess({ todos })),
          catchError((error: unknown) =>
            of(
              TodoActions.loadTodosFailure({
                error: error instanceof Error ? error.message : 'Failed to load todos',
              }),
            ),
          ),
        );
      }),
    ),
  );

  /**
   * Any action that mutates the todo list gets mirrored to localStorage.
   * `withLatestFrom` reads state *after* the reducer has already applied
   * the action, so this always persists the up-to-date list.
   */
  persist$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.addTodo,
          TodoActions.removeTodo,
          TodoActions.toggleTodo,
          TodoActions.clearCompleted,
          TodoActions.loadTodosSuccess,
        ),
        withLatestFrom(this.store.select(selectTodos)),
        tap(([, todos]) => this.todoService.saveToStorage(todos)),
      ),
    { dispatch: false },
  );
}
