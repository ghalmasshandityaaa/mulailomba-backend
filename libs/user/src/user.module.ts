import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_READ_REPOSITORY, USER_SERVICE } from './constants';
import { TypeOrmUserReadRepository } from './repositories';
import { UserService } from './services';

const Services: Provider<any>[] = [
  {
    provide: USER_SERVICE,
    useClass: UserService,
  },
];

const Repositories = [
  {
    provide: USER_READ_REPOSITORY,
    useClass: TypeOrmUserReadRepository,
  },
];

@Module({
  imports: [CqrsModule],
  providers: [...Services, ...Repositories],
  exports: [...Services],
})
export class UserModule {}
