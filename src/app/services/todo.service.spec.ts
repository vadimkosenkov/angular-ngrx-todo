import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RemoteTodo } from '../models/todo.model';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('loadFromStorage / saveToStorage', () => {
    it('should return null when nothing has been saved yet', () => {
      expect(service.loadFromStorage()).toBeNull();
    });

    it('should round-trip todos saved to localStorage', () => {
      const todos = [
        { id: '1', title: 'Buy milk', completed: false, createdAt: '2026-01-01T00:00:00.000Z' },
      ];

      service.saveToStorage(todos);

      expect(service.loadFromStorage()).toEqual(todos);
    });

    it('should return null instead of throwing when the stored value is corrupt JSON', () => {
      localStorage.setItem('ngrx-todo-app.todos', '{not valid json');

      expect(service.loadFromStorage()).toBeNull();
    });
  });

  describe('fetchSeedTodos', () => {
    it('should map the remote API shape into the app Todo model', () => {
      const remoteTodos: RemoteTodo[] = [
        { userId: 1, id: 101, title: 'delectus aut autem', completed: false },
        { userId: 1, id: 102, title: 'quis ut nam facilis et officia qui', completed: true },
      ];

      let result: unknown;
      service.fetchSeedTodos().subscribe((todos) => (result = todos));

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos?_limit=5');
      expect(req.request.method).toBe('GET');
      req.flush(remoteTodos);

      expect(result).toEqual([
        jasmine.objectContaining({ title: 'delectus aut autem', completed: false }),
        jasmine.objectContaining({
          title: 'quis ut nam facilis et officia qui',
          completed: true,
        }),
      ]);
    });

    it('should give every seeded todo a generated id and createdAt', () => {
      const remoteTodos: RemoteTodo[] = [
        { userId: 1, id: 101, title: 'delectus aut autem', completed: false },
      ];

      let result: { id: string; createdAt: string }[] = [];
      service.fetchSeedTodos().subscribe((todos) => (result = todos));

      httpMock.expectOne('https://jsonplaceholder.typicode.com/todos?_limit=5').flush(remoteTodos);

      expect(result[0].id).toBeTruthy();
      expect(new Date(result[0].createdAt).toString()).not.toBe('Invalid Date');
    });
  });
});
