import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './slack-config';
import { SlackConfigService } from './slack-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [config],
    }),
  ],
  providers: [SlackConfigService],
  exports: [SlackConfigService],
})
export class SlackConfigModule {}
