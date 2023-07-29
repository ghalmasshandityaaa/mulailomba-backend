import { CloudinaryService } from '@mulailomba/cloudinary';
import {
  Base64FileInterceptor,
  FileUtils,
  Identity,
  IIdentity,
  RolePermission,
  Roles,
  UploadedFileType,
} from '@mulailomba/common';
import { JwtAuthGuard, RoleGuard } from '@mulailomba/common/guards';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { omit } from 'lodash';
import { UploadFileBodyDTO } from './file.dto';

@Controller({
  path: 'files',
  version: '1',
})
export class FileController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileUtils.filterCallback(),
      limits: { fileSize: 10000000 }, // 10mb
    }),
    Base64FileInterceptor,
  )
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER, RolePermission.USER)
  async upload(
    @Identity() identity: IIdentity,
    @UploadedFile() file: UploadedFileType,
    @Body() body: UploadFileBodyDTO,
  ) {
    console.log(1, omit(file, 'buffer', 'base64'));
    const { filename } = FileUtils.generateFilename(file, identity.id);
    console.log(2, omit(file, 'buffer', 'base64'));
    const result = await this.cloudinary.signedUpload(file, {
      use_filename: true,
      unique_filename: false,
      public_id: filename,
      folder: body.topic,
    });

    return { file: result };
  }
}
