import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck, heroTrash } from '@ng-icons/heroicons/outline';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  imports: [NgIcon],
  providers: [provideIcons({ heroCheck, heroTrash })],
  template: `
    <li
      class="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <button
        type="button"
        (click)="toggled.emit(todo().id)"
        [attr.aria-label]="todo().completed ? 'Mark as not completed' : 'Mark as completed'"
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition"
        [class.border-slate-300]="!todo().completed"
        [class.dark:border-slate-600]="!todo().completed"
        [class.border-emerald-500]="todo().completed"
        [class.bg-emerald-500]="todo().completed"
      >
        @if (todo().completed) {
          <ng-icon name="heroCheck" size="14" class="text-white" />
        }
      </button>

      <span
        class="flex-1 truncate text-sm text-slate-800 transition dark:text-slate-100"
        [class.line-through]="todo().completed"
        [class.text-slate-400]="todo().completed"
        [class.dark:text-slate-500]="todo().completed"
      >
        {{ todo().title }}
      </span>

      <button
        type="button"
        (click)="remove.emit(todo().id)"
        aria-label="Delete task"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950 dark:hover:text-red-400"
      >
        <ng-icon name="heroTrash" size="16" />
      </button>
    </li>
  `,
})
export class TodoItemComponent {
  readonly todo = input.required<Todo>();
  readonly toggled = output<string>();
  readonly remove = output<string>();
}
