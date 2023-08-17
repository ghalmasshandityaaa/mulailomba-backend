export interface UploadedFileType {
  filename: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  base64: string;
}

export type FileType = {
  publicId: string;
  secureUrl: string;
};
