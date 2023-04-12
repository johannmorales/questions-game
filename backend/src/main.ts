import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './scoket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  await app.listen(configService.get('port'));
}
bootstrap();
