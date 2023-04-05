import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Sse,
  Headers,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { interval, map, Observable } from 'rxjs';
import { AppService } from './auth/app.service';
import { GameStateService } from './game-state.service';
import { Roles } from './auth/roles.decorator';
import { Role } from './types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly gameStateService: GameStateService,
  ) {}

  @Roles(Role.Admin)
  @Get('questions')
  async getQuestions(@Headers() headers): Promise<boolean> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Roles(Role.Admin)
  @Post('questions')
  async updateQuestions(): Promise<boolean> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Sse('game-state')
  gameState(): Observable<MessageEvent> {
    return interval(750).pipe(
      map((_) => ({ data: this.gameStateService.get() } as MessageEvent)),
    );
  }
}
