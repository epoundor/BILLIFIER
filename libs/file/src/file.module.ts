import { Module, DynamicModule, Provider } from '@nestjs/common';
import { FileService } from './file.service';
import { LocalFileAdapter } from './adapters/local-file.adapter';

export enum FileAdapter {
  LOCAL,
  CLOUDINARY,
  S3,
}
@Module({})
export class FileModule {
  static forRoot(
    adapter: FileAdapter.LOCAL,
    options: { uploadDir: string },
  ): DynamicModule;
  static forRoot(
    adapter: FileAdapter = FileAdapter.LOCAL,
    options?: any,
  ): DynamicModule {
    let fileAdapterProvider: Provider;

    switch (adapter) {
      case FileAdapter.LOCAL:
        fileAdapterProvider = {
          provide: 'FILE_ADAPTER',
          useFactory: () =>
            new LocalFileAdapter(options?.uploadDir || './uploads'),
        };
        break;

      // case 'cloudinary':
      //   fileAdapterProvider = {
      //     provide: 'FILE_ADAPTER',
      //     useFactory: () => new CloudinaryAdapter(options),
      //   };
      //   break;

      // case 's3':
      //   fileAdapterProvider = {
      //     provide: 'FILE_ADAPTER',
      //     useFactory: () => new S3Adapter(options),
      //   };
      //   break;

      default:
        throw new Error(`Unsupported file adapter: ${adapter}`);
    }

    return {
      module: FileModule,
      providers: [FileService, fileAdapterProvider],
      exports: [FileService],
    };
  }
}
