import { Injectable } from '@nestjs/common';
import {
  BucketItem,
  BucketItemFromList,
  Client,
  ItemBucketMetadata,
  UploadedObjectInfo,
} from 'minio';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Stream } from 'stream';
import { MinioConfigService } from './config';

@Injectable()
export class MinioService {
  private _minio: Client;

  constructor(
    @InjectPinoLogger(MinioService.name)
    private readonly logger: PinoLogger,
    private readonly configService: MinioConfigService,
  ) {
    this._minio = new Client({
      endPoint: this.configService.minioEndpoint,
      port: this.configService.minioPort,
      useSSL: this.configService.minioSsl,
      accessKey: this.configService.minioAccessKey,
      secretKey: this.configService.minioPrivateKey,
    });
  }

  /**
   *
   * @param bucketName
   * @returns
   */
  async bucketExists(bucketName: string): Promise<boolean> {
    const method = 'bucketExists';
    this.logger.trace({ method }, 'BEGIN');
    this.logger.debug({ bucketName });

    const bucketExists = await this._minio.bucketExists(bucketName);

    this.logger.trace({ method }, 'END');
    return bucketExists;
  }

  /**
   *
   * @param bucketName
   * @param policy
   */
  async createBucket(bucketName: string, policy?: string): Promise<void> {
    const method = 'createBucket';
    this.logger.trace({ method }, 'BEGIN');
    this.logger.debug({ bucketName });

    const _policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['s3:*'],
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    try {
      await this._minio.makeBucket(bucketName);
      await this._minio.setBucketPolicy(bucketName, policy || JSON.stringify(_policy));
    } catch (err: any) {
      this.logger.warn(`error when create ${bucketName} bucket, reason: ${err.message}`);
    }

    this.logger.trace({ method }, 'END');
  }

  /**
   *
   * @returns
   */
  async listBucket(): Promise<BucketItemFromList[]> {
    const method = 'listBucket';
    this.logger.trace({ method }, 'BEGIN');

    const buckets = await this._minio.listBuckets();

    this.logger.trace({ method }, 'END');
    return buckets;
  }

  /**
   *
   * @param bucketName
   * @param prefix
   * @returns
   */
  async listObject(bucketName: string, prefix?: string): Promise<BucketItem[]> {
    const method = 'createBucket';
    this.logger.trace({ method }, 'BEGIN');
    this.logger.debug({ bucketName });

    const items: BucketItem[] = [];
    try {
      const stream = this._minio.listObjectsV2(bucketName, prefix);
      const _items = new Promise<BucketItem[]>((resolve, reject) => {
        const chunk = Array<BucketItem>();

        stream.on('data', (item: BucketItem) => chunk.push(item));
        stream.on('end', () => resolve(chunk));
        stream.on('error', (err) => reject(`error converting stream - ${err}`));
      });

      items.push(...(await _items));
    } catch (err: any) {
      this.logger.warn(
        `error when get list object from ${bucketName} bucket, reason: ${err.message}`,
      );
    }

    this.logger.trace({ method }, 'END');
    return items;
  }

  /**
   *
   * @param fileName
   * @param bucketName
   * @returns
   */
  async getPresignedUrl(
    fileName: string,
    bucketName: string,
  ): Promise<{ url: string; secureUrl: string } | undefined> {
    const method = 'getPresignedUrl';
    this.logger.trace({ method }, 'BEGIN');
    this.logger.debug({ fileName, bucketName });

    const baseUrl = 'https://minio.mulailomba.com';

    let file: string;
    try {
      file = await this._minio.presignedUrl('GET', bucketName, fileName);
    } catch (err: any) {
      this.logger.warn(
        `error when getting presigned url object from minio, reason: ${err.message}`,
      );
      return undefined;
    }

    this.logger.trace({ method }, 'END');

    return {
      url: `${baseUrl}/${bucketName}/${fileName}`,
      secureUrl: file.replace(
        `http://${this.configService.minioEndpoint}:${this.configService.minioPort}`,
        baseUrl,
      ),
    };
  }

  /**
   *
   * @param fileName
   * @param bucketName
   * @returns
   */
  async getObject(fileName: string, bucketName: string): Promise<Buffer | undefined> {
    const method = 'getPresignedUrl';
    this.logger.trace({ method }, 'BEGIN');
    this.logger.debug({ fileName, bucketName });

    let buffer: Buffer | undefined;
    try {
      const file = await this._minio.getObject(bucketName, fileName);
      buffer = await this.stream2buffer(file);
    } catch (err: any) {
      this.logger.warn(`error when get object from minio, reason: ${err.message}`);
    }

    this.logger.trace({ method }, 'END');
    return buffer;
  }

  /**
   *
   * @param params
   * @returns
   */
  async putObject(params: {
    fileName: string;
    bucketName: string;
    file: Buffer;
    metadata?: ItemBucketMetadata;
  }): Promise<UploadedObjectInfo | undefined> {
    const method = 'getPresignedUrl';
    this.logger.trace({ method }, 'BEGIN');

    const { bucketName, fileName, file, metadata } = params;

    let result: UploadedObjectInfo | undefined;
    try {
      result = await this._minio.putObject(bucketName, fileName, file, undefined, metadata);
    } catch (err: any) {
      this.logger.warn(`error when putting object to minio, reason: ${err.message}`);
    }

    this.logger.trace({ method }, 'END');
    return result;
  }

  /**
   *
   * @param fileName
   * @param bucketName
   */
  async deleteObject(fileName: string, bucketName: string): Promise<void> {
    const method = 'deleteObject';
    this.logger.trace({ method }, 'BEGIN');
    this.logger.debug({ fileName, bucketName });

    try {
      await this._minio.removeObject(bucketName, fileName);
    } catch (err: any) {
      this.logger.warn(`error when deleting object to minio, reason: ${err.message}`);
    }

    this.logger.trace({ method }, 'END');
  }

  /**
   *
   * @param stream
   * @returns
   */
  private async stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const _buf = Array<any>();

      stream.on('data', (chunk) => _buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(_buf)));
      stream.on('error', (err) => reject(`error converting stream - ${err}`));
    });
  }
}
