import { TestBed } from '@angular/core/testing';
import { makeTodo } from '../../testing/todo.fixtures';
import { TodoItemComponent } from './todo-item.component';

describe('TodoItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TodoItemComponent] });
  });

  it('should render the todo title', () => {
    const fixture = TestBed.createComponent(TodoItemComponent);
    fixture.componentRef.setInput('todo', makeTodo({ title: 'Buy milk' }));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector('span')?.textContent;
    expect(text?.trim()).toBe('Buy milk');
  });

  it('should not show a strikethrough style for an incomplete todo', () => {
    const fixture = TestBed.createComponent(TodoItemComponent);
    fixture.componentRef.setInput('todo', makeTodo({ completed: false }));
    fixture.detectChanges();

    const span = (fixture.nativeElement as HTMLElement).querySelector('span');
    expect(span?.classList.contains('line-through')).toBe(false);
  });

  it('should show a strikethrough style for a completed todo', () => {
    const fixture = TestBed.createComponent(TodoItemComponent);
    fixture.componentRef.setInput('todo', makeTodo({ completed: true }));
    fixture.detectChanges();

    const span = (fixture.nativeElement as HTMLElement).querySelector('span');
    expect(span?.classList.contains('line-through')).toBe(true);
  });

  it('should emit toggled with the todo id when the checkbox button is clicked', () => {
    const fixture = TestBed.createComponent(TodoItemComponent);
    fixture.componentRef.setInput('todo', makeTodo({ id: 'abc-123' }));
    fixture.detectChanges();

    const emitted: string[] = [];
    fixture.componentInstance.toggled.subscribe((id) => emitted.push(id));

    const [checkboxButton] = fixture.nativeElement.querySelectorAll('button');
    checkboxButton.click();

    expect(emitted).toEqual(['abc-123']);
  });

  it('should emit remove with the todo id when the delete button is clicked', () => {
    const fixture = TestBed.createComponent(TodoItemComponent);
    fixture.componentRef.setInput('todo', makeTodo({ id: 'abc-123' }));
    fixture.detectChanges();

    const emitted: string[] = [];
    fixture.componentInstance.remove.subscribe((id) => emitted.push(id));

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();

    expect(emitted).toEqual(['abc-123']);
  });
});
