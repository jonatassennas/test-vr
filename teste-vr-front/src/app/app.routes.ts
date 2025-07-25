import { Routes } from '@angular/router';
import { NotificacaoComponent } from './notificacao.component/notificacao.component';

export const routes: Routes = [
  { path: '', component: NotificacaoComponent },
  { path: '**', redirectTo: '' }
];
