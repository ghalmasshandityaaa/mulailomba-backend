import { MinioModule } from '@mulailomba/minio';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_READ_REPOSITORY, USER_SERVICE, USER_WRITE_REPOSITORY } from './constants';
import { UserController } from './controllers';
import { TypeOrmUserEntities } from './entities';
import { Listeners } from './listeners';
import { QueryHandlers } from './queries';
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
  controllers: [UserController],
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmUserEntities), MinioModule.forRoot()],
  providers: [...Services, ...Repositories, ...QueryHandlers, ...Listeners],
  exports: [...Services],
})
export class UserModule {}
