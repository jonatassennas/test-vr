import { Component } from '@angular/core';
import { NotificacaoService } from '../services/notificacao.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  styleUrls: ['./notificacao.component.scss']
})
export class NotificacaoComponent {
  conteudoMensagem = '';
  notificacoes: Notificacao[] = [];

  constructor(private readonly notificacaoService: NotificacaoService) {}

  enviar() {
    if (!this.conteudoMensagem.trim()) {
      alert('Mensagem não pode ser vazia!');
      return;
    }

    const mensagemId = uuidv4();
    const novaNotificacao: Notificacao = {
      mensagemId,
      conteudoMensagem: this.conteudoMensagem,
      status: 'AGUARDANDO PROCESSAMENTO'
    };

    this.notificacoes.push(novaNotificacao);

    this.notificacaoService.enviarNotificacao({
      mensagemId,
      conteudoMensagem: this.conteudoMensagem
    }).subscribe({
      next: () => {
        console.log('Notificação enviada');
      },
      error: (err) => {
        console.error('Erro ao enviar:', err);
        novaNotificacao.status = 'ERRO';
      }
    });

    this.conteudoMensagem = '';
  }
}
