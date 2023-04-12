import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    this.logger.log(
      `Configuring SocketIO server with custom CORS options ${JSON.stringify(
        cors,
      )}`,
    );

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
      maxHttpBufferSize: 1e2,
      allowRequest: async (req, callback) => {
        const token = req.headers.authorization;
        if (!token) {
          return callback(null, false);
        }

        if (!token) {
          this.logger.log(
            `Disconnected ${req.headers.origin} ${req.headers['user-agent']} (no authorization token)`,
          );
          return callback(null, false);
        }

        if (
          token !== this.configService.get('tokenGame') &&
          token !== this.configService.get('tokenAdmin')
        ) {
          this.logger.log(
            `Disconnected ${req.headers.origin} ${req.headers['user-agent']} (unknown authorization token)`,
          );
          return callback(null, false);
        }

        this.logger.log(
          `Connected ${req.headers.origin} ${req.headers['user-agent']}`,
        );
        return callback(null, true);
      },
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);
    return server;
  }
}
