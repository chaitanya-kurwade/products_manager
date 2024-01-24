import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { Public } from 'common/library';
import { diskStorage } from 'multer';
import fs from 'fs';
import { UploadimageService } from './uploadimage.service';

@Controller('images')
export class UploadimageController {
  constructor(private readonly uploadimageService: UploadimageService) {}

  @Public()
  @Get(':imageName')
  async viewImage(
    @Res() res: Response,
    @Param('imageName') fileName: string,
  ): Promise<string | any> {
    try {
      const filepath = join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        `${fileName}`,
      );

      // const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
      //   fs.readFile(filepath, (err, data) => {
      //     if (err) reject(err);
      //     else resolve(data);
      //   });
      // });
      // console.log(imageBuffer, 'buffer');

      // const fileExtension =
      //   (filepath && filepath.split('.').pop().toLowerCase()) || 'jpg';
      // let contentType;
      // if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      //   contentType = 'image/jpeg';
      // } else if (fileExtension === 'png') {
      //   contentType = 'image/png';
      // } else {
      //   contentType = 'image/jpeg';
      // }

      // // Set response headers for client download from Express lib
      // res.setHeader('Content-Type', contentType); // Change the content type to the appropriate image format
      // res.setHeader('Content-Type', `image/${fileName.split('.').pop()}`);

      // // Stream the image to the response
      // const stream = fs.createReadStream(filepath);
      // console.log({ stream });
      // res.send(stream);
      // stream.pipe(res);
      // Set the content type to image/*
      // res.setHeader('Content-Type', `image/${fileName.split('.').pop()}`);

      // Set Content-Disposition to inline to display the image in the browser
      // res.setHeader('Content-Disposition', 'inline');

      // Stream the image to the response
      // Check if the file exists
      if (!fs.existsSync(filepath)) {
        return res.status(404).send('Image not found');
      }
      res.sendFile(filepath);
    } catch (e) {
      res.status(404).send('File not found');
    }
  }

  @Post('/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniquePrefix =
            Date.now() + '_' + Math.round(Math.random() * 1e9);
          cb(null, `${uniquePrefix}_${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const fileNames: string[] = [];
    for (const file of files) {
      const fileName = file.filename; // Access the path of each uploaded file
      console.log(fileName);
      fileNames.push(`${fileName}`);
    }
    console.log(fileNames);

    // Process the uploaded files here
    return fileNames;
  }
}

// ? //////////////////////////////////////////////////////////

// @Post('upload')
// @UseInterceptors(FilesInterceptor('files'))
// async importExcelData(
//   @UploadedFiles() files: Express.Multer.File[],
// ): Promise<any[]> {
//   const fileNames: string[] = [];
//   for (const file of files) {
//     const fileName = file.filename; // Access the path of each uploaded file
//     console.log(fileName);
//     fileName.push(fileName);
//   }
//   console.log(fileNames);

//   return fileNames;
// }

/*
  // @Get('view')
  // async viewImage(
  //   @Res() res: Response,
  //   @Query('file') filename: string,
  // ): Promise<void> {
  //   try {
  //     const image = await new Promise<Buffer>((resolve, reject) => {
  //       fs.readFile(filepath, {}, (err, data) => {
  //         if (err) reject(err);
  //         else resolve(data);
  //       });
  //     });

  //     // Set response headers for client download
  //     res.setHeader('Content-Type', 'application/pdf');
  //     res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
  //     res.send(pdfBuffer);
  //   } catch (e) {
  //     res.status(404).send('File not found');
  //   }
  // }


module
MulterModule.register({
  dest: './uploads/assessment', // Specify the destination directory for uploaded files
}),

controller
@Post('uploadExcel')
  @Roles(UserType.ADMIN)
  @UseInterceptors(FileInterceptor('file')) // 'file' is the field name for the uploaded file
  async importExcelData(@UploadedFile() file: Express.Multer.File): Promise<boolean> {
    const filePath = file.path; // Access the path of the uploaded file
    const jsonResult = await this.assessmentsService.importExcelData(filePath);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.unlinkSync(file.path);
    return jsonResult;
  }
*/
