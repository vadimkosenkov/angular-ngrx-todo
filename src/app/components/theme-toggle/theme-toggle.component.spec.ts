import { TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';

function mockMatchMedia(prefersDark: boolean): void {
  spyOn(window, 'matchMedia').and.returnValue({
    matches: prefersDark,
  } as MediaQueryList);
}

describe('ThemeToggleComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({ imports: [ThemeToggleComponent] });
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should default to the system preference when nothing is stored', () => {
    mockMatchMedia(true);

    const fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should default to light when the system has no dark preference and nothing is stored', () => {
    mockMatchMedia(false);

    const fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should restore a previously saved theme from localStorage over the system preference', () => {
    localStorage.setItem('ngrx-todo-app.theme', 'dark');
    mockMatchMedia(false);

    const fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should toggle the theme, the document class, and localStorage on click', () => {
    localStorage.setItem('ngrx-todo-app.theme', 'light');

    const fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('ngrx-todo-app.theme')).toBe('dark');
    expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
  });
});
