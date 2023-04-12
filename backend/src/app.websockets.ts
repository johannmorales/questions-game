import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { ModuleRef } from '@nestjs/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { GameState } from './types';
import { GameService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Logger, OnModuleInit } from '@nestjs/common';

@WebSocketGateway({})
export class EventsGateway implements OnGatewayConnection, OnModuleInit {
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;

  gameService: GameService;

  constructor(
    private moduleRef: ModuleRef,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.gameService = this.moduleRef.get(GameService);
  }

  handleConnection(client: Socket) {
    client.emit('GameStateUpdate', this.gameService.getState());
  }

  emitUpdate() {
    this.server.emit('GameStateUpdate', this.gameService.getState());
  }

  @SubscribeMessage('events')
  nextQuestion(
    data: Pick<GameState, 'questionIndex' | 'questionContent' | 'options'>,
  ) {
    this.server.emit('nextQuestion', {
      ...data,
    });
  }

  selectOption(index: GameState['selectedOptionIndex']) {
    this.server.emit('selectOption', index);
  }

  correctAnswer() {
    this.server.emit('correctAnswer');
  }

  wrongAnswer() {
    this.server.emit('wrongAnswer');
  }
}
