import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { ImageUploadService } from './image-upload.service';
import { ImageUpload } from './entities/image-upload.entity';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { createWriteStream } from 'fs';
import { CreateImageUploadInput } from './dto/create-image-upload.input';
import * as fs from 'fs';

@Resolver(() => ImageUpload)
export class ImageUploadResolver {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  // @Mutation(() => String)
  // async getImage(@Args('filename') filename: string, @Context('res') res: Response): Promise<string> {

  //   const imagePath =  await this.imageUploadService.getImageUrl(filename);
  //   const stream = fs.createReadStream(imagePath);

  //   return new Promise((resolve, reject) => {
  //     stream.on('error', (err) => {
  //       console.error('Error reading file stream:', err);
  //       reject('Internal Server Error');
  //     });

  //     // res.headers('Content-Type', 'image/jpeg');
  //     // res.headers('Content-Disposition', `inline; filename=${filename}`);

  //     stream.on('end', () => {
  //       resolve('Image sent successfully');
  //     });
  //   });

  // }

  @Mutation(() => [ImageUpload])
  async uploadImages(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: Upload[],
    @Args({ name: 'createFileInDirectory', type: () => Boolean })
    createFileInDirectory: boolean,
  ): Promise<CreateImageUploadInput[]> {
    const uploads: any[] = [];
    // console.log('UPLOAD_IMAGE_CALLED', {
    //   files,
    //   createFileInDirectory,
    // });

    if (createFileInDirectory) {
      for (const file of files) {
        const {
          file: { filename, mimetype, encoding, createReadStream },
        } = file;
        const stream = createReadStream();
        const path = `./uploads/${filename}`;
        await new Promise<void>((resolve, reject) =>
          stream
            .pipe(createWriteStream(path))
            .on('finish', () => {
              console.log('IMAGE_CREATED_IN_DIRECTORY_resolve', file),
                resolve();
            })
            .on('error', () => {
              console.log('IMAGE_NOT_CREATED_IN_DIRECTORY_reject'), reject;
            }),
        );
        uploads.push({ filename, mimetype, encoding: 'UTF-8' });
      }
    } else {
      for (const file of files) {
        const { createReadStream } = await file;
        const stream = createReadStream();
        await new Promise<void>((resolve, reject) =>
          stream
            .on('data', (data: any) => {
              console.log('DATA_FROM_STREAM', data);
            })
            .on('end', () => {
              console.log('END_OF_STREAM'), resolve();
            })
            .on('error', (error: any) => {
              console.log('IMAGE_UPLOAD_ERROR', error), reject();
            }),
        );
      }
    }
    // save to database
    const uploadedImages =
      await this.imageUploadService.processUploadedFiles(uploads);
    return uploadedImages;
  }
}
