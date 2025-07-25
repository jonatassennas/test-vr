import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private readonly apiUrl = 'http://localhost:3000/api/notificar';

  constructor(private readonly http: HttpClient) {}

  enviarNotificacao(payload: { mensagemId: string; conteudoMensagem: string }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
