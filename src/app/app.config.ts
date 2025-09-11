import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideCocktailsState } from './state/cocktails/cocktails.feature';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withDebugTracing()),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(),
    provideEffects(),
    ...provideCocktailsState(),

    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
