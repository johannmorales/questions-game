import { cpus } from 'os';

type Lock = {
  release: () => void;
};

type WaitingPromise = {
  resolve: (lock: Lock) => void;
  reject: (err?: Error) => void;
};

export class Semaphore {
  private running = 0;
  private waiting: WaitingPromise[] = [];

  constructor(public max: number = cpus().length) {}

  private take = () => {
    if (this.waiting.length > 0 && this.running < this.max) {
      this.running++;

      const task = this.waiting.shift();

      task.resolve({ release: this.release });
    }
  };

  acquire = (): Promise<Lock> => {
    if (this.running < this.max) {
      this.running++;
      return Promise.resolve({ release: this.release });
    }

    return new Promise<Lock>((resolve, reject) => {
      this.waiting.push({ resolve, reject });
    });
  };

  private release = () => {
    this.running--;
    this.take();
  };

  purge = () => {
    this.waiting.forEach((task) => {
      task.reject(
        new Error(
          'The semaphore was purged and as a result this task has been cancelled',
        ),
      );
    });

    this.running = 0;
    this.waiting = [];
  };
}

export async function timeout<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((_resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Async call timeout limit reached')),
      ms,
    );
  });

  return Promise.race([fn(), timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
}
