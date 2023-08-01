import { CloudinaryService } from '@mulailomba/cloudinary';
import { FileUtils } from '@mulailomba/common';
import { FileType } from '@mulailomba/file/file.constants';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadApiErrorResponse } from 'cloudinary';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UploadFileCommand } from './upload-file.command';

type UploadFileResponse = { file: FileType | UploadApiErrorResponse };
@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand, UploadFileResponse> {
  constructor(
    @InjectPinoLogger(UploadFileHandler.name)
    private readonly logger: PinoLogger,
    private readonly cloudinary: CloudinaryService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: UploadFileCommand): Promise<UploadFileResponse> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const { filename } = FileUtils.generateFilename(command.file, command.identityId);
    const file = await this.cloudinary.signedUpload(command.file, {
      use_filename: true,
      unique_filename: false,
      public_id: filename,
      folder: command.topic,
    });

    this.logger.trace(`END`);
    return { file };
  }
}
