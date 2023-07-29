import { FileError } from '../errors';
import { UploadedFileType } from '../interfaces';

export type FilterType = 'IMAGES' | 'DOCS' | 'PPT' | 'PDF' | 'EXCEL' | 'FILE';
export class FileUtils {
  /**
   *
   * @param params {customFilename?: string, type: filterType}
   * @returns callback
   */
  static filterCallback(params?: { customFilename?: string; type?: FilterType }) {
    return (req, file, callback) => {
      if (!params) {
        params = { type: 'IMAGES' };
      }

      const type = req?.headers?.[`x-file-type`];
      if (type) params.type = type.toUpperCase();

      let regex: RegExp;
      switch (params.type) {
        case 'IMAGES':
          regex = /\.(jpg|jpeg|png|gif|svg|webp|JPG|JPEG|PNG|GIF|SVG|WEBP)$/;
          break;
        case 'DOCS':
          regex = /\.(doc|docs|DOC|DOCS)$/;
          break;
        case 'PPT':
          regex = /\.(ppt|pptx|PPT|PPTX)$/;
          break;
        case 'PDF':
          regex = /\.(pdf|PDF)$/;
          break;
        case 'EXCEL':
          regex = /\.(xls|xlsx|XLS|XLSX)$/;
          break;
        case 'FILE':
          regex = /\.(zip|rar|tar|ZIP|RAR|TAR)$/;
          break;
        default:
          regex =
            /\.(jpg|jpeg|png|gif|svg|webp|zip|rar|tar|JPG|JPEG|PNG|GIF|SVG|WEBP|ZIP|RAR|TAR)$/;
          break;
      }

      const isValidFormat = file.originalname.match(regex);
      if (!isValidFormat) {
        return callback(new FileError.UnsupportedFormat(), false);
      }

      if (params.customFilename) {
        const ext = file.originalname.split('.').pop();
        file.filename = params.customFilename;
        file.originalname = `${params.customFilename}.${ext}`;
      }

      callback(null, true);
    };
  }

  /**
   *
   * @param file
   * @param accountId
   * @param topic
   * @returns
   */
  static generateFilename(
    file: UploadedFileType,
    accountId: string,
    topic?: string,
  ): { filename: string; originalname: string } {
    if (topic) topic = topic.replace(/_/g, '').toUpperCase();

    const ext = file.originalname.split('.').pop();
    const filename = `${accountId}${topic ? `_${topic}` : ''}`;

    file.filename = filename;
    file.originalname = `${filename}.${ext}`;

    return { filename, originalname: file.originalname };
  }
}
