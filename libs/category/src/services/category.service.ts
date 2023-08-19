import { Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CATEGORY_READ_REPOSITORY } from '../category.constants';
import { CategoryQueryModel, ICategoryReadRepository, ICategoryService } from '../interfaces';

export class CategoryService implements ICategoryService {
  constructor(
    @InjectPinoLogger(CategoryService.name)
    private logger: PinoLogger,
    @Inject(CATEGORY_READ_REPOSITORY)
    private readonly repository: ICategoryReadRepository,
  ) {}

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: string): Promise<CategoryQueryModel | undefined> {
    this.logger.trace('BEGIN');
    this.logger.info({ id });

    const user = await this.repository.findById(id);

    this.logger.trace('END');
    return user;
  }
}
