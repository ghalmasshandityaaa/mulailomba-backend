import { CloudinaryService } from '@mulailomba/cloudinary';
import { FileType, FileUtils, RolePermission, UploadedFileType } from '@mulailomba/common';
import { ORGANIZER_SERVICE } from '@mulailomba/organizer/constants';
import { OrganizerAggregate } from '@mulailomba/organizer/domains';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerService } from '@mulailomba/organizer/interfaces';
import { TOKEN_SERVICE } from '@mulailomba/token/constants';
import { ITokenService } from '@mulailomba/token/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RegisterOrganizerCommand } from './register-organizer.command';
import { RegisterOrganizerResult } from './register-organizer.result';

@CommandHandler(RegisterOrganizerCommand)
export class RegisterOrganizerCodeHandler
  implements ICommandHandler<RegisterOrganizerCommand, RegisterOrganizerResult>
{
  constructor(
    @InjectPinoLogger(RegisterOrganizerCodeHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ORGANIZER_SERVICE)
    private readonly organizerService: IOrganizerService,
    private readonly cloudinary: CloudinaryService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: RegisterOrganizerCommand): Promise<RegisterOrganizerResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const { profile, background, userId, ...data } = command;
    const organizer = await this.organizerService.findByEmail(command.emailAddress);
    if (organizer) throw new OrganizerError.EmailTaken();

    const uploadPromises: Array<Promise<FileType>> = [];
    if (profile) {
      uploadPromises.push(this.upload({ file: profile, type: 'PROFILE', userId }));
    }

    if (background) {
      uploadPromises.push(this.upload({ file: background, type: 'BACKGROUND', userId }));
    }

    let newProfile: FileType | undefined;
    let newBackground: FileType | undefined;
    if (uploadPromises.length) {
      const response = await Promise.all(uploadPromises);
      if (uploadPromises.length === 2) {
        newProfile = response[0];
        newBackground = response[1];
      } else if (profile) {
        newProfile = response[0];
      } else {
        newBackground = response[0];
      }
    }

    const newOrganizer = OrganizerAggregate.create({
      ...data,
      userId,
      profile: newProfile || undefined,
      background: newBackground || undefined,
    });

    const [token] = await Promise.all([
      this.tokenService.generateToken({
        id: newOrganizer.id,
        isActive: newOrganizer.props.isActive,
        role: RolePermission.ORGANIZER,
      }),
      this.organizerService.create(newOrganizer),
    ]);

    const result = new RegisterOrganizerResult(token, newOrganizer);

    this.logger.trace(`END`);
    return result;
  }

  private async upload(params: {
    file: UploadedFileType;
    userId: string;
    type: 'BACKGROUND' | 'PROFILE';
  }) {
    // eslint-disable-next-line prefer-const
    let { file, type, userId } = params;

    file = { ...file, base64: file.buffer.toString('base64') };

    const { filename } = FileUtils.generateFilename(file, userId);
    const response = await this.cloudinary.signedUpload(file, {
      use_filename: true,
      unique_filename: false,
      public_id: filename,
      folder: `${userId}/${type}`,
    });

    return response;
  }
}
