import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GameService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { Role } from './types';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly gameService: GameService,
  ) {}

  @Post('restart')
  restart(): void {
    this.gameService.restart();
  }

  @Post('select-option')
  selectOption(@Body() body): void {
    this.gameService.selectOption(body.index);
  }

  @Post('next-question')
  nextQuestion(): void {
    this.gameService.nextQuestion();
  }

  @Post('reveal-answer')
  revealAnswer(): void {
    this.gameService.revealAnswer();
  }

  @Post('open-survey')
  openSurvey(): void {
    this.gameService.openSurvey();
  }

  @Post('run-survey')
  runSurvey(): void {
    this.gameService.runSurvey();
  }

  @Post('close-survey')
  closeSurvey(): void {
    this.gameService.closeSurvey();
  }

  @Post('open-wheel')
  openWheel(): void {
    this.gameService.openWheel();
  }

  @Post('run-wheel')
  runWheel(): void {
    this.gameService.runWheel();
  }

  @Post('close-wheel')
  closeWheel(): void {
    this.gameService.closeWheel();
  }

  @Post('reveal-next')
  revealNext(): void {
    this.gameService.revealNext();
  }

  @Roles(Role.Admin)
  @Post('questions')
  async updateQuestions(): Promise<boolean> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
