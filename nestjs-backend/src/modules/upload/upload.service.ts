import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = './uploads';

  constructor() {
    // Ensure uploads directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Get the URL for an uploaded file
   */
  getFileUrl(file: Express.Multer.File): string {
    return `/uploads/${file.filename}`;
  }

  /**
   * Save a base64 encoded image
   */
  async saveBase64Image(
    base64String: string,
    filename?: string,
  ): Promise<{ imageUrl: string; filename: string }> {
    // Validate base64 string
    if (!base64String || !base64String.startsWith('data:image')) {
      throw new BadRequestException('Invalid image data');
    }

    try {
      // Extract the file extension from the base64 header
      const matches = base64String.match(/data:image\/(\w+);base64,/);
      if (!matches) {
        throw new BadRequestException('Invalid base64 image format');
      }

      const ext = matches[1];
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const finalFilename = filename
        ? `${filename}-${uniqueSuffix}.${ext}`
        : `image-${uniqueSuffix}.${ext}`;

      const filePath = join(this.uploadDir, finalFilename);

      // Write file
      writeFileSync(filePath, buffer);

      return {
        imageUrl: `/uploads/${finalFilename}`,
        filename: finalFilename,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to save image');
    }
  }

  /**
   * Validate file type
   */
  isValidImageType(mimetype: string): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(mimetype);
  }

  /**
   * Get file extension from mimetype
   */
  getExtensionFromMimetype(mimetype: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    return mimeToExt[mimetype] || '.jpg';
  }
}
