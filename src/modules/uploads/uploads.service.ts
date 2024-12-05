import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadsService {
  getMulterConfig(folder: string) {
    return {
      storage: diskStorage({
        destination: `./uploads/${folder}`,
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const fileName = `${file.fieldname}-${Date.now()}${fileExtName}`;
          callback(null, fileName);
        },
      }),
    };
  }
}