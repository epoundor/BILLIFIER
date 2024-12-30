import { Injectable, Inject } from '@nestjs/common';
import { IFileAdapter } from './adapters/file.adapter.interface';

@Injectable()
export class FileService {
  constructor(
    @Inject('FILE_ADAPTER') private readonly fileAdapter: IFileAdapter,
  ) {}

  async upload(file: Buffer, fileName: string): Promise<string> {
    return this.fileAdapter.uploadFile(file, fileName);
  }

  async delete(fileUrl: string): Promise<void> {
    return this.fileAdapter.deleteFile(fileUrl);
  }

  async get(fileUrl: string) {
    return this.fileAdapter.getFile(fileUrl);
  }
}
