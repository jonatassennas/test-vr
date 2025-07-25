import { Component, NgZone, OnInit } from '@angular/core';
import { NotificacaoService } from '../services/notificacao.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../services/websocket.service';

interface Notificacao {
  mensagemId: string;
  conteudoMensagem: string;
  status: string;
}

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.scss'],
})
export class NotificacaoComponent implements OnInit {
  conteudoMensagem = '';
  notificacoes: Notificacao[] = [];

  constructor(
    private readonly notificacaoService: NotificacaoService,
    private readonly webSocketService: WebSocketService,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit() {
    this.webSocketService.onStatusUpdate().subscribe((update: any) => {
      this.ngZone.run(() => {
        const index = this.notificacoes.findIndex(
          (n) => n.mensagemId === update.mensagemId
        );
        if (index !== -1) {
          this.notificacoes[index].status = update.status;
        }
      });
    });
  }

  enviar() {
    if (!this.conteudoMensagem.trim()) {
      alert('Mensagem não pode ser vazia!');
      return;
    }

    const mensagemId = uuidv4();
    const novaNotificacao: Notificacao = {
      mensagemId,
      conteudoMensagem: this.conteudoMensagem,
      status: 'AGUARDANDO PROCESSAMENTO',
    };

    this.notificacoes.push(novaNotificacao);

    this.notificacaoService
      .enviarNotificacao({
        mensagemId,
        conteudoMensagem: this.conteudoMensagem,
      })
      .subscribe({
        error: (err) => {
          console.error('Erro ao enviar:', err);
          novaNotificacao.status = 'ERRO';
        },
      });

    this.conteudoMensagem = '';
  }
}
