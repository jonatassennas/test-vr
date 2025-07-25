import { AppService } from './app.service';
import { RabbitMQService } from './rabbitmq.service';
import { StatusService } from './status.service';

describe('AppService', () => {
  let service: AppService;
  let mockRabbit: Partial<RabbitMQService>;
  let mockStatusService: Partial<StatusService>;
  let mockChannel: any;

  beforeEach(() => {
    mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
    };

    mockRabbit = {
      getChannel: jest.fn(() => mockChannel),
    };

    mockStatusService = {
      setStatus: jest.fn(),
      getStatus: jest.fn(),
    };

    service = new AppService(
      mockRabbit as RabbitMQService,
      mockStatusService as StatusService,
    );
  });

  it('deve lançar erro se a mensagem estiver vazia', async () => {
    await expect(service.notificar({ conteudoMensagem: '' })).rejects.toThrow('A mensagem não pode estar vazia');
    await expect(service.notificar({ conteudoMensagem: '   ' })).rejects.toThrow('A mensagem não pode estar vazia');
  });

  it('deve publicar a mensagem na fila e setar o status', async () => {
    const dto = { conteudoMensagem: 'Teste de mensagem' };

    const result = await service.notificar(dto);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith('fila.notificacao.entrada.jonatas');

    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'fila.notificacao.entrada.jonatas',
      expect.any(Buffer),
    );

    const sentBuffer = mockChannel.sendToQueue.mock.calls[0][1];
    const sentMessage = JSON.parse(sentBuffer.toString());
    expect(sentMessage).toMatchObject({
      mensagemId: result.mensagemId,
      conteudoMensagem: dto.conteudoMensagem,
    });

    expect(mockStatusService.setStatus).toHaveBeenCalledWith(result.mensagemId, 'PROCESSANDO');

    expect(result).toHaveProperty('mensagemId');
    expect(typeof result.mensagemId).toBe('string');
  });

  it('deve retornar o status correto', () => {
    const id = '123';
    (mockStatusService.getStatus as jest.Mock).mockReturnValue('PROCESSANDO');

    const status = service.getStatus(id);

    expect(mockStatusService.getStatus).toHaveBeenCalledWith(id);
    expect(status).toBe('PROCESSANDO');
  });
});