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
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileCommand } from '../commands';
import { UploadFileBodyDTO } from '../dtos';

@Controller({
  path: 'files',
  version: '1',
})
export class FileController {
  constructor(private readonly commandBus: CommandBus) {}

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
    const command = new UploadFileCommand({
      file,
      topic: body.topic,
      identityId: identity.id,
    });

    return await this.commandBus.execute(command);
  }
}
