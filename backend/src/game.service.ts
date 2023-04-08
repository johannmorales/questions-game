import { Injectable, Logger } from '@nestjs/common';
import { GameState, Questionaire } from './types';
import { Client } from 'tmi.js';
import { ConfigService } from '@nestjs/config';
import { Semaphore } from './utils';
import { EventsGateway } from './app.websockets';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  private semaphore = new Semaphore(1);
  private questioniaire: Questionaire = [
    { content: 'P1', options: ['OpA', 'OpB', 'OpC', 'OpD'], answerIndex: 1 },
    {
      content: 'P2',
      options: ['Op2A', 'Op2B', 'Op2C', 'Op2D'],
      answerIndex: 2,
    },
    {
      content: 'P3',
      options: ['Op3A', 'Op3B', 'Op3C', 'Op3D'],
      answerIndex: 3,
    },
  ];
  private gameState: GameState = {
    showQuestion: false,
    showOptionsUntil: 0,
    answerIndex: 0,
    questionContent: '1',
    questionIndex: null,
    options: ['', '', '', ''],
    questions: 15,
    survey: [0, 0, 0, 0],
    showSurvey: false,
    sound: 0,
    selectedOptionIndex: null,
    wheel: {
      show: false,
      result: null,
    },
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  private async update(generator: (_: GameState) => GameState): Promise<void> {
    const lock = await this.semaphore.acquire();
    try {
      const result = generator(this.gameState);
      this.logger.log(JSON.stringify(result));
      this.gameState = result;
      this.eventsGateway.server.emit('GameStateUpdate', this.getState());
    } catch (error) {
      this.logger.error(error);
    } finally {
      lock.release();
    }
  }

  getState(): GameState {
    return this.gameState;
  }

  openSurvey() {
    this.update((prev) => ({
      ...prev,
      showSurvey: true,
      survey: [0, 0, 0, 0],
    }));
  }

  async runSurvey(): Promise<void> {
    if (!this.gameState || !this.gameState.showSurvey) {
      return;
    }

    const surveyAnswer = new Map();

    const client = new Client({
      channels: [this.configService.get('channel')],
    });

    client.connect();

    client.on('message', (_, tags, _message) => {
      const message = _message.trim();
      // if (message.length === 1 && message.match(/^[a-d]/gi)) {
      const userId = tags['user-id'];
      const oldAnswer = surveyAnswer.get(userId);
      const answer = Math.round(Math.random() * 3);
      // message.charAt(0).toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
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
      // }
    });

    setTimeout(() => {
      client.disconnect();
    }, this.configService.get('surveyDurationInSeconds') * 1000);
  }

  closeSurvey() {
    this.update((prev) => ({
      ...prev,
      showSurvey: false,
    }));
  }

  async nextQuestion(): Promise<void> {
    this.update((prev) => {
      const nextIndex =
        prev.questionIndex !== null ? prev.questionIndex + 1 : 0;
      if (nextIndex < this.questioniaire.length) {
        const next = this.questioniaire[nextIndex];
        this.eventsGateway.server.emit('QuestionStart');
        return {
          ...prev,
          questionContent: next.content,
          options: [...next.options],
          questionIndex: nextIndex,
          answerIndex: null,
          showQuestion: false,
          showOptionsUntil: 0,
          selectedOptionIndex: null,
        };
      } else {
        return prev;
      }
    });
  }

  selectOption(index: number) {
    this.update((prev) => {
      if (prev.selectedOptionIndex === null) {
        this.eventsGateway.server.emit('OptionChosen');
      }
      return {
        ...prev,
        selectedOptionIndex: index,
      };
    });
  }

  revealAnswer() {
    this.update((prev) => {
      if (prev.selectedOptionIndex === null) {
        return prev;
      }

      this.eventsGateway.server.emit(
        'RevealAnswer',
        this.questioniaire[prev.questionIndex].answerIndex ===
          prev.selectedOptionIndex,
      );

      return {
        ...prev,
        answerIndex: this.questioniaire[prev.questionIndex].answerIndex,
      };
    });
  }

  runSound(): void {
    this.update((a) => ({ ...a, sound: a.sound + 1 }));
  }

  restart() {
    this.update(() => ({
      answerIndex: undefined,
      options: undefined,
      questionContent: undefined,
      showQuestion: false,
      showOptionsUntil: 0,
      questionIndex: null,
      questions: this.questioniaire.length,
      showSurvey: false,
      sound: 1,
      survey: [0, 0, 0, 0],
      selectedOptionIndex: null,
      wheel: {
        show: false,
        result: null,
      },
    }));
  }

  openWheel() {
    this.update((prev) => ({
      ...prev,
      wheel: {
        show: true,
        result: null,
      },
    }));
  }

  runWheel() {
    this.update((prev) => ({
      ...prev,
      wheel: {
        show: true,
        result: Math.floor(Math.random() * 4),
      },
    }));
  }

  closeWheel() {
    this.update((prev) => ({
      ...prev,
      wheel: {
        show: false,
        result: null,
      },
    }));
  }
}
