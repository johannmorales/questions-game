import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './auth/app.service';
import { AuthGuard } from './auth/auth.guard';
import { GameService } from './game.service';
import { RolesGuard } from './auth/role.guard';
import { EventsGateway } from './app.websockets';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => ({
          channel: process.env.CHANNEL || '',
          surveyDurationInSeconds: parseInt(
            process.env.SURVEY_DURATION_IN_SECONDS,
          ),
          tokenAdmin: process.env.TOKEN_ADMIN || '',
          tokenGame: process.env.TOKEN_GAME || '',
          port: process.env.PORT || 3000,
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GameService,
    EventsGateway,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
