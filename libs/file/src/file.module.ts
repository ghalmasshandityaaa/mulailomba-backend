import { CloudinaryModule } from '@mulailomba/cloudinary';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { FileController } from './controllers';

@Module({
  imports: [CqrsModule, CloudinaryModule.forRoot()],
  controllers: [FileController],
  providers: [...CommandHandlers],
})
export class FileModule {}
