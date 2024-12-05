import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AdminGuard } from 'src/guards/admin.guard';
import MulterFile from 'src/interfaces/movies/multerfile.interface';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get(':folder/:filename')
  getFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    const filePath = `./uploads/${folder}/${filename}`;
    return res.sendFile(filePath, { root: '.' });
  }

  @Post(':folder')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('folder') folder: string,
    @UploadedFile() file: MulterFile
  ) {
    return {
      message: 'File uploaded successfully',
      filePath: `uploads/${folder}/${file.filename}`,
    };
  }
}
