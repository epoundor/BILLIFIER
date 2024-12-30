import { Stream } from 'stream';

export interface IFileAdapter {
  uploadFile(file: Buffer, fileName: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  getFile(fileUrl: string): Promise<Stream>;
}
