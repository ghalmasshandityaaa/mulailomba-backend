import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_READ_REPOSITORY, USER_SERVICE, USER_WRITE_REPOSITORY } from './constants';
import { TypeOrmUserEntities } from './entities';
import { TypeOrmUserReadRepository, TypeOrmUserWriteRepository } from './repositories';
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
  {
    provide: USER_WRITE_REPOSITORY,
    useClass: TypeOrmUserWriteRepository,
  },
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmUserEntities)],
  providers: [...Services, ...Repositories],
  exports: [...Services],
})
export class UserModule {}
