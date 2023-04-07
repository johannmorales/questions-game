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
import { GameService } from './game.service';
import { Roles } from './auth/roles.decorator';
import { Role } from './types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly gameStateService: GameService,
  ) {}

  @Get('questions')
  async getQuestions(@Headers() headers): Promise<boolean> {
    return false;
  }

  @Roles(Role.Admin)
  @Post('questions')
  async updateQuestions(): Promise<boolean> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
