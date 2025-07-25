import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { App } from './app/app';
import 'zone.js';
import { provideSocketIo } from 'ngx-socket-io';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideSocketIo({ url: 'http://localhost:3000' }),
  ],
}).catch((err) => console.error(err));
