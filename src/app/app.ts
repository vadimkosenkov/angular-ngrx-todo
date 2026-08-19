import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoActions } from './store/todo/todo.actions';

@Component({
  selector: 'app-root',
  imports: [ThemeToggleComponent, TodoListComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    // Kicks off TodoEffects.init$: hydrate from localStorage, or seed from the API.
    this.store.dispatch(TodoActions.init());
  }
}
