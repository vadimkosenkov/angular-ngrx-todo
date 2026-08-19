import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { todoFeature } from './store/todo/todo.reducer';
import { TodoEffects } from './store/todo/todo.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideStore({ [todoFeature.name]: todoFeature.reducer }),
    provideEffects(TodoEffects),
    // DevTools connect to the Redux DevTools browser extension; disabled in production builds.
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
