import { CloudinaryModule } from '@mulailomba/cloudinary';
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';

@Module({
  imports: [CloudinaryModule.forRoot()],
  controllers: [FileController],
})
export class FileModule {}
