import { IFileAdapter } from './file.adapter.interface';
import { promises as fs } from 'fs'; // Import des méthodes basées sur les promesses
import * as fsSync from 'fs'; // Import du module classique pour createReadStream
import * as path from 'path';
import { Stream } from 'stream';

export class LocalFileAdapter implements IFileAdapter {
  private readonly uploadDir: string;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
  }

  async uploadFile(file: Buffer, fileName: string): Promise<string> {
    const filePath = path.resolve(this.uploadDir, fileName);
    await fs.mkdir(this.uploadDir, { recursive: true });
    await fs.writeFile(filePath, file);
    return filePath; // Retourne le chemin local complet
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const filePath = path.resolve(fileUrl);
    await fs.unlink(filePath);
  }

  async getFile(fileUrl: string): Promise<Stream> {
    const filePath = path.resolve(fileUrl);
    if (!fsSync.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fsSync.createReadStream(filePath); // Utilisation de fsSync pour createReadStream
  }
}
