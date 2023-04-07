import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ModuleRef } from '@nestjs/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { GameState } from './types';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  gameService: GameService;

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.gameService = this.moduleRef.get(GameService);
  }

  handleConnection(client: Socket) {
    client.emit('update2', this.gameService.get());
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

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
