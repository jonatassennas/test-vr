import { Body, Controller, Get, Param, Post, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('notificar')
  async notificar(@Body() body: { conteudoMensagem: string }, @Res() res: Response) {
    try {
      const { mensagemId } = await this.appService.notificar(body);
      return res.status(202).json({ mensagem: 'Mensagem recebida', mensagemId });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  @Get('status/:id')
  getStatus(@Param('id') id: string) {
    const status = this.appService.getStatus(id);
    if (!status) {
      throw new HttpException('Mensagem não encontrada', HttpStatus.NOT_FOUND);
    }
    return { mensagemId: id, status };
  }
}
