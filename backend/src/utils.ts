// https://gist.github.com/cahilfoley/4b1b2f3fa9e2f9652ee1d8501443b5ca

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

  private take = () => {
    if (this.waiting.length > 0 && this.running < 1) {
      this.running++;

      const task = this.waiting.shift();

      task.resolve({ release: this.release });
    }
  };

  acquire = (): Promise<Lock> => {
    if (this.running < 1) {
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
