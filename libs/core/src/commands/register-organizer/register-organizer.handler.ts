import { DateUtils, RolePermission, UploadedFileType } from '@mulailomba/common';
import { MinioService } from '@mulailomba/minio';
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
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    private readonly minio: MinioService,
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

    const uploadPromises: Array<Promise<{ url: string; secureUrl: string } | undefined>> = [];
    if (profile) {
      uploadPromises.push(this.upload({ file: profile, type: 'PROFILE', userId }));
    }

    if (background) {
      uploadPromises.push(this.upload({ file: background, type: 'BACKGROUND', userId }));
    }

    let newProfile: string | undefined;
    let newBackground: string | undefined;
    if (uploadPromises.length) {
      const response = await Promise.all(uploadPromises);
      if (uploadPromises.length === 2) {
        newProfile = response[0]?.url;
        newBackground = response[1]?.url;
      } else if (profile) {
        newProfile = response[0]?.url;
      } else {
        newBackground = response[0]?.url;
      }
    }

    const newOrganizer = OrganizerAggregate.create({
      ...data,
      userId,
      profile: newProfile,
      background: newBackground,
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
  }): Promise<{ url: string; secureUrl: string } | undefined> {
    const { file, userId, type } = params;

    const exist = await this.minio.bucketExists(userId);
    if (!exist) await this.minio.createBucket(userId);

    const timestamp = DateUtils.toUnix(new Date());
    const filename = `${type}/${timestamp}-${file.originalname}`.replace(/\s/g, '');
    await this.minio.putObject({
      fileName: filename,
      bucketName: userId,
      file: file.buffer,
      metadata: {
        'Content-Type': file.mimetype,
      },
    });

    const response = await this.minio.getPresignedUrl(filename, userId);
    return response;
  }
}
