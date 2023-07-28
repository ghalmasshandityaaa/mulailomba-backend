import { UploadedFileType } from '@mulailomba/common';
import { FileType } from '@mulailomba/event/entities/typeorm.event.entity';
import { Inject, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Readable } from 'stream';
import { CloudinaryOptions, CLOUDINARY_OPTIONS } from './cloudinary.interface';

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectPinoLogger(CloudinaryService.name)
    private readonly logger: PinoLogger,
    @Inject(CLOUDINARY_OPTIONS)
    private readonly options: CloudinaryOptions,
  ) {
    cloudinary.config({
      cloud_name: this.options.cloudName,
      api_key: this.options.apiKey,
      api_secret: this.options.apiSecret,
    });
  }

  /**
   *
   * @returns ok | error
   */
  async ping() {
    try {
      const res = await cloudinary.api.ping();
      this.logger.info(`Cloudinary connection ${res.status}`);
      return 'ok';
    } catch (err) {
      this.logger.warn('Cloudinary connection failed.');
      this.logger.error(err.error);
      return 'error';
    }
  }

  /**
   * It takes a file, uploads it to cloudinary, and returns a promise
   * @param {UploadedFileType} file - IFile - This is the file object that is passed to the uploadFile method.
   * @param {UploadApiOptions} [options] - This is the options object that you can pass to the
   * uploader.upload method.
   * @returns FileType | UploadApiErrorResponse
   */
  async signedUpload(
    file: UploadedFileType,
    options?: UploadApiOptions,
  ): Promise<FileType | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.base64}`,
        options,
        (error, result) => {
          if (error) reject(error);
          if (result) {
            const mappedResult: FileType = {
              publicId: result.public_id,
              secureUrl: result.secure_url,
            };
            resolve(mappedResult);
          }
        },
      );
    });
  }

  /**
   * It takes a file, uploads it to cloudinary, and returns a promise
   * @param {UploadedFileType} file - IFile - This is the file object that is passed to the uploadFile method.
   * @param {UploadApiOptions} [options] - This is the options object that you can pass to the
   * uploader.upload_stream method.
   * @returns FileType | UploadApiErrorResponse
   */
  async uploadStream(
    file: UploadedFileType,
    options?: UploadApiOptions,
  ): Promise<FileType | UploadApiErrorResponse> {
    return new Promise(async (resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) reject(error);
        if (result) {
          const mappedResult: FileType = {
            publicId: result.public_id,
            secureUrl: result.secure_url,
          };
          resolve(mappedResult);
        }
      });

      const stream: Readable = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(upload);
    });
  }
}
