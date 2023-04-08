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
    private readonly gameService: GameService,
  ) {}

  @Post('restart')
  restart(@Headers() headers): void {
    this.gameService.restart();
  }

  @Post('select-option')
  selectOption(@Headers() headers): void {
    this.gameService.selectOption(1);
  }

  @Post('next-question')
  nextQuestion(@Headers() headers): void {
    this.gameService.nextQuestion();
  }

  @Post('reveal-answer')
  revealAnswer(@Headers() headers): void {
    this.gameService.revealAnswer();
  }

  @Post('open-survey')
  openSurvey(@Headers() headers): void {
    this.gameService.openSurvey();
  }

  @Post('run-survey')
  runSurvey(@Headers() headers): void {
    this.gameService.runSurvey();
  }

  @Post('close-survey')
  closeSurvey(@Headers() headers): void {
    this.gameService.closeSurvey();
  }

  @Post('open-wheel')
  openWheel(@Headers() headers): void {
    this.gameService.openWheel();
  }

  @Post('run-wheel')
  runWheel(@Headers() headers): void {
    this.gameService.runWheel();
  }

  @Post('close-wheel')
  closeWheel(@Headers() headers): void {
    this.gameService.closeWheel();
  }

  @Roles(Role.Admin)
  @Post('questions')
  async updateQuestions(): Promise<boolean> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
