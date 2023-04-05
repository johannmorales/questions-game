import { Injectable } from '@nestjs/common';
import { GameState, Questionaire } from './types';
import { Client } from 'tmi.js';
import { ConfigService } from '@nestjs/config';
import { Semaphore } from './utils';

@Injectable()
export class GameStateService {
  private semaphore = new Semaphore();
  private questioniaire: Questionaire;
  private gameState: GameState = {
    showQuestion: false,
    showOptionsUntil: 0,
    answerIndex: 0,
    questionContent: '1',
    questionIndex: 1,
    options: ['', '', '', ''],
    questions: 15,
    survey: [0, 0, 0, 0],
    showSurvey: false,
  };

  constructor(private readonly configService: ConfigService) {}

  private async update(generator: (_: GameState) => GameState): Promise<void> {
    const lock = await this.semaphore.acquire();
    try {
      const result = generator(this.gameState);
      this.gameState = result;
    } catch (error) {
    } finally {
      lock.release();
    }
  }

  get(): GameState {
    return this.gameState;
  }

  async runSurvey(): Promise<void> {
    if (!this.gameState || this.gameState.showSurvey) {
      return;
    }

    await this.update((prev) => ({
      ...prev,
      survey: [0, 0, 0, 0],
      showSurvey: true,
    }));

    const surveyAnswer = new Map();

    const client = new Client({
      channels: [this.configService.get('channel')],
    });

    client.connect();

    client.on('message', (_, tags, _message) => {
      const message = _message.trim();
      if (message.length === 1 && message.match(/^[a-d]/gi)) {
        const userId = tags['user-id'];
        const oldAnswer = surveyAnswer.get(userId);
        const answer = Math.round(Math.random() * 3);
        message.charAt(0).toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        if (oldAnswer !== answer) {
          surveyAnswer.set(userId, answer);
          this.update((prev) => {
            const result = [...prev.survey];
            if (oldAnswer !== undefined) {
              result[oldAnswer]--;
            }
            result[answer]++;
            return { ...prev, survey: result };
          });
        }
      }
    });

    setTimeout(() => {
      client.disconnect();
    }, this.configService.get('surveyDurationInSeconds') * 1000);
  }

  async nextQuestion(): Promise<void> {
    this.update((prev) => {
      const nextIndex = prev.questionIndex;
      const next = this.questioniaire[nextIndex];
      return {
        ...prev,
        questionContent: next.content,
        options: [...next.options],
        questionIndex: prev.questionIndex + 1,
        answerIndex: undefined,
      };
    });
  }
}
