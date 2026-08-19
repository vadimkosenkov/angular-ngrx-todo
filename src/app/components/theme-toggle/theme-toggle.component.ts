import { Component, effect, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMoon, heroSun } from '@ng-icons/heroicons/outline';

const THEME_STORAGE_KEY = 'ngrx-todo-app.theme';
type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-toggle',
  imports: [NgIcon],
  providers: [provideIcons({ heroSun, heroMoon })],
  template: `
    <button
      type="button"
      (click)="toggle()"
      class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
      [attr.aria-label]="theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    >
      <ng-icon [name]="theme() === 'dark' ? 'heroSun' : 'heroMoon'" size="20" />
    </button>
  `,
})
export class ThemeToggleComponent {
  protected readonly theme = signal<Theme>(this.readInitialTheme());

  constructor() {
    // Keep the DOM class and localStorage in sync whenever the signal changes.
    effect(() => {
      const current = this.theme();
      document.documentElement.classList.toggle('dark', current === 'dark');
      localStorage.setItem(THEME_STORAGE_KEY, current);
    });
  }

  protected toggle(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private readInitialTheme(): Theme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return prefersDark ? 'dark' : 'light';
  }
}
