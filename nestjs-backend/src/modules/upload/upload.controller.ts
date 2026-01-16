import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * POST /api/upload/image
   * Upload a single image
   */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = this.uploadService.getFileUrl(file);
    
    return {
      success: true,
      imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }

  /**
   * POST /api/upload/images
   * Upload multiple images (max 5)
   */
  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedFiles = files.map(file => ({
      imageUrl: this.uploadService.getFileUrl(file),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    }));

    return {
      success: true,
      count: uploadedFiles.length,
      files: uploadedFiles,
    };
  }

  /**
   * POST /api/upload/base64
   * Upload image from base64 string
   */
  @Post('base64')
  async uploadBase64(@UploadedFile() body: { image: string; filename?: string }) {
    if (!body.image) {
      throw new BadRequestException('No image data provided');
    }

    const result = await this.uploadService.saveBase64Image(body.image, body.filename);
    
    return {
      success: true,
      imageUrl: result.imageUrl,
      filename: result.filename,
    };
  }
}
