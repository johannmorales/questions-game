import { Injectable, Logger } from '@nestjs/common';
import { GameState, Questionaire } from './types';
import { Client } from 'tmi.js';
import { ConfigService } from '@nestjs/config';
import { Semaphore, timeout } from './utils';
import { EventsGateway } from './app.websockets';

const retry = async (fn, maxAttempts: number) => {
  const execute = async (attempt: number) => {
    try {
      console.log(attempt, ' || Running Retry =>', maxAttempts);
      const result = await fn();
      console.log(attempt, ' || Success Retry =>', maxAttempts);
      return result;
    } catch (err) {
      console.error(attempt, '=>', 'fn caused error', err);
      if (attempt <= maxAttempts) {
        const nextAttempt = attempt + 1;
        // const delayInSeconds = Math.max(
        //   Math.min(
        //     Math.pow(2, nextAttempt) + randInt(-nextAttempt, nextAttempt),
        //     600,
        //   ),
        //   1,
        // );
        const delayInSeconds = 2;
        console.error(`Retrying after ${delayInSeconds} seconds due to:`, err);
        return delay(() => execute(nextAttempt), delayInSeconds * 1000);
      } else {
        throw err;
      }
    }
  };
  return execute(1);
};

const delay = (fn, ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(fn()), ms));

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getDifference = (a, b) => {
  if (a === null && b === null) {
    return {};
  }
  if (a === null) {
    return Object.fromEntries(Object.entries(b));
  } else if (b === null) {
    return Object.fromEntries(Object.entries(a));
  }
  return Object.fromEntries(
    Object.entries(b).filter(([key, val]) => key in a && a[key] !== val),
  );
};

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private readonly tmiLogger = new Logger('tmi.js');

  private semaphore = new Semaphore(1);
  private questioniaire: Questionaire = [
    {
      content: 'Cuánto es 1+1?',
      options: ['2', '3', '1', '0'],
      answerIndex: 0,
    },
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

  private gameState: GameState | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  private async update(
    generator: (_: GameState) => GameState | null,
  ): Promise<void> {
    const lock = await this.semaphore.acquire();
    try {
      const result = generator(this.gameState);
      if (result !== null) {
        this.logger.log('Game State Update', JSON.stringify(result));
        this.logger.log(
          'Diff',
          JSON.stringify(getDifference(this.gameState, result)),
        );
        this.gameState = result;
        this.eventsGateway.server.emit('GameStateUpdate', this.getState());
      }
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
      survey: null,
      runningSurvey: false,
    }));
  }

  async createSocket(): Promise<Client> {
    let notConnectedClient: Client;
    try {
      const client = await timeout(
        () =>
          new Promise<Client>((resolve, reject) => {
            notConnectedClient = new Client({
              channels: [this.configService.get('channel')],
              logger: {
                error: (...args) => this.tmiLogger.error(...args),
                info: (...args) => this.tmiLogger.debug(...args),
                warn: (...args) => this.tmiLogger.warn(...args),
              },
              connection: {
                reconnect: false,
              },
              options: {
                debug: true,
                skipMembership: true,
                skipUpdatingEmotesets: true,
              },
            });
            this.tmiLogger.debug('CONNECTION: started');
            notConnectedClient
              .connect()
              .then(() => {
                this.tmiLogger.debug('CONNECTION: success');
                resolve(notConnectedClient);
              })
              .catch(() => {
                this.tmiLogger.debug('CONNECTION: error');
                reject();
              });
          }),
        2000,
      );
      return client;
    } catch (error) {
      console.log('THrowing esrror', error);
      if (notConnectedClient) {
        notConnectedClient.disconnect();
      }
      throw error;
    }
  }

  async runSurvey(): Promise<void> {
    if (
      !this.gameState ||
      !this.gameState.showSurvey ||
      this.gameState.runningSurvey
    ) {
      // return;
    }

    await this.update((prev) => ({
      ...prev,
      runningSurvey: true,
      survey: [0, 0, 0, 0],
      surveryError: null,
    }));
    const surveyAnswer = new Map();
    const users = [
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
    ];

    try {
      const client = await this.createSocket();

      client.on('connecting', (address, port) => {
        this.logger.log(`Connecting to Twitch[${address}:${port}]`);
      });

      client.on('connected', (address, port) => {
        this.logger.log(`Connected to Twitch[${address}:${port}]`);
        this.logger.log(
          `Killing connection in ${this.configService.get(
            'surveyDurationInSeconds',
          )} seconds`,
        );
        setTimeout(async () => {
          try {
            this.logger.log(`Closing connection to Twitch[${address}:${port}]`);
            await client.disconnect();
            this.logger.log(`Closed connection to Twitch[${address}:${port}]`);
            this.update((prev) => ({ ...prev, runningSurvey: false }));
            console.log(users);
          } catch (error) {
            this.logger.error(error);
          }
        }, this.configService.get('surveyDurationInSeconds') * 1000);
      });

      client.on('reconnect', () => {
        this.tmiLogger.warn('Reconnecting');
      });

      client.on('disconnected', () => {
        this.tmiLogger.warn('Disconnected');
      });

      client.on('join', () => {
        this.tmiLogger.log('Joined');
      });
      client.on('message', (_, tags, _message) => {
        const message = _message.trim();
        // if (message.length === 1 && message.match(/^[a-d]/gi)) {
        const userId = tags['user-id'];
        const oldAnswer = surveyAnswer.get(userId);
        const answer = Math.floor(Math.random() * 3);
        // message.charAt(0).toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        if (oldAnswer !== answer) {
          if (oldAnswer !== undefined) {
            users[oldAnswer].delete(tags.username);
          }
          users[answer].add(tags.username);
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
      });
    } catch (error) {
      this.tmiLogger.error(error);
      this.update((prev) => ({
        ...prev,
        runningSurvey: false,
        survey: null,
        surveyError: true,
      }));
    }
  }

  closeSurvey() {
    this.update((prev) => ({
      ...prev,
      showSurvey: false,
      runningSurvey: false,
      survey: null,
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
        return null;
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
        return null;
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

  restart() {
    this.update(() => ({
      answerIndex: null,
      adminAnswerIndex: null,
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
      runningSurvey: false,
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

  revealNext() {
    this.update((prev) => {
      if (prev.showQuestion && prev.showOptionsUntil >= 4) {
        return null;
      }

      const clone = { ...prev };
      if (!clone.showQuestion) {
        clone.showQuestion = true;
      } else if (clone.showOptionsUntil < 4) {
        clone.showOptionsUntil++;
      }

      if (prev.showQuestion && prev.showOptionsUntil === 3) {
        this.eventsGateway.server.emit('WaitingAnswer');
      }
      return clone;
    });
  }
}
