import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacaoComponent } from './notificacao.component';
import { NotificacaoService } from '../services/notificacao.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let httpMock: HttpTestingController;
  let notificacaoService: NotificacaoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificacaoComponent],
      imports: [provideHttpClientTesting, FormsModule],
      providers: [NotificacaoService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    notificacaoService = TestBed.inject(NotificacaoService);
    httpMock = TestBed.inject(HttpTestingController);

    spyOn<any>(require('uuid'), 'v4').and.returnValue('123e4567-e89b-12d3-a456-426614174000');

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve adicionar notificação e enviar requisição POST com sucesso', () => {
    component.conteudoMensagem = 'Minha mensagem de teste';

    component.enviar();

    expect(component.notificacoes.length).toBe(1);
    expect(component.notificacoes[0]).toEqual({
      mensagemId: '123e4567-e89b-12d3-a456-426614174000',
      conteudoMensagem: 'Minha mensagem de teste',
      status: 'AGUARDANDO PROCESSAMENTO',
    });

    expect(component.conteudoMensagem).toBe('');

    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      mensagemId: '123e4567-e89b-12d3-a456-426614174000',
      conteudoMensagem: 'Minha mensagem de teste',
    });

    req.flush({});
  });

  it('deve atualizar status para ERRO em caso de falha na requisição', () => {
    component.conteudoMensagem = 'Mensagem com erro';

    component.enviar();

    const notif = component.notificacoes[0];
    expect(notif.status).toBe('AGUARDANDO PROCESSAMENTO');

    const req = httpMock.expectOne('http://localhost:3000/api/notificar');
    req.error(new ErrorEvent('Network error'));

    expect(notif.status).toBe('ERRO');
  });

  it('não deve enviar mensagem vazia', () => {
    spyOn(window, 'alert');
    component.conteudoMensagem = ' ';

    component.enviar();

    expect(window.alert).toHaveBeenCalledWith('Mensagem não pode ser vazia!');
    expect(component.notificacoes.length).toBe(0);
  });
});
