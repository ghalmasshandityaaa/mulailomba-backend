import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MAILER_SERVICE } from './mailer.constant';
import { MailerService } from './services';

const Services: Provider<any>[] = [
  {
    provide: MAILER_SERVICE,
    useClass: MailerService,
  },
];

@Module({
  imports: [CqrsModule],
  providers: [...Services],
  exports: [...Services],
})
export class MailerModule {}
