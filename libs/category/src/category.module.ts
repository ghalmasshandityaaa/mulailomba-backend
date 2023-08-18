import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CATEGORY_READ_REPOSITORY, CATEGORY_SERVICE } from './category.constants';
import { TypeOrmCategoryEntities } from './entities/typeorm';
import { TypeOrmCategoryReadRepository } from './repositories/typeorm/typeorm.category.read-repository';
import { CategoryService } from './services';

const Services: Provider<any>[] = [
  {
    provide: CATEGORY_SERVICE,
    useClass: CategoryService,
  },
];

const Repositories = [
  {
    provide: CATEGORY_READ_REPOSITORY,
    useClass: TypeOrmCategoryReadRepository,
  },
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmCategoryEntities)],
  providers: [...Repositories, ...Services],
  exports: [...Services],
})
export class CategoryModule {}
