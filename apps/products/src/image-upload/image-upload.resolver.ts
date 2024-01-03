import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ImageUploadService } from './image-upload.service';
import { ImageUpload } from './entities/image-upload.entity';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { FileUpload } from 'graphql-upload-ts';

@Resolver(() => ImageUpload)
export class ImageUploadResolver {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Mutation(() => ImageUpload)
  async uploadFiles(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: Upload[],
    @Args({ name: 'createFileInDirectory', type: () => Boolean })
    createFileInDirectory: boolean,
  ): Promise<ImageUpload[]> {
    const uploads: any[] = [];
    console.log('UPLOAD_IMAGE_CALLED', {
      files,
      createFileInDirectory,
    });

    if (createFileInDirectory) {
      for (const file of files) {
        // const { createReadStream, filename, mimetype } = await file;
        const {
          file: { filename, mimetype, encoding, createReadStream },
          } = file;
        console.log(file);
        const stream = createReadStream();
        // const path = join(__dirname, '/uploads');
        const path = `./uploads/${filename}`;
        await new Promise<void>((resolve, reject) =>
          stream
            .pipe(createWriteStream(path))
            .on('finish', () => {
              console.log('IMAGE_CREATED_IN_DIRECTORY'), resolve();
            })
            .on('error', () => {
              console.log('IMAGE_CREATED_IN_DIRECTORY'), reject;
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
    console.log('Uploads');
    console.log(uploads);
    
    await this.imageUploadService.processUploadedFiles(uploads);

    // Fetch
    const savedImages = await this.imageUploadService.getSavedImages();
    return savedImages;
  }
  ////////////////////////////////

  // @Mutation(() => Boolean, { name: 'uploadImage' })
  // async uploadImage(
  //   @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload,
  //   @Args({ name: 'createFileInDirectory', type: () => Boolean }) createFileInDirectory: boolean,
  // ): Promise<boolean> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       // const { createReadStream, filename } = await image;

  //       if (createFileInDirectory) {
  //         // const dirPath = join(__dirname, '/uploads');

  //         // if (!existsSync(dirPath)) {
  //         //   mkdirSync(dirPath, { recursive: true });
  //         // }

  //         // createReadStream()
  //         //   .pipe(createWriteStream(`${dirPath}/${filename}`))
  //         //   .on('finish', () => {
  //         //     console.log('IMAGE_CREATED_IN_DIRECTORY');
  //         //     resolve(true);
  //         //   })
  //         //   .on('error', (error) => {
  //         //     console.log('IMAGE_UPLOAD_ERROR', error);
  //         //     reject(false);
  //         //   });
         
  //         const { filename, createReadStream } = await image;
  //         console.log(image);
  //         return new Promise((resolve, reject) =>
  //           createReadStream()
  //             .pipe(createWriteStream(`./public/${filename}`))
  //             .on('finish', () => resolve())
  //             .on('error', () => reject(false)),
  //         )
    
  //       } 
  //       // else {
  //         // createReadStream()
  //         //   .on('data', (data) => {
  //         //     console.log('DATA_FROM_STREAM', data);
  //         //   })
  //         //   .on('end', () => {
  //         //     console.log('END_OF_STREAM');
  //         //     resolve(true);
  //         //   })
  //         //   .on('error', (error) => {
  //         //     console.log('IMAGE_UPLOAD_ERROR', error);
  //         //     reject(false);
  //         //   });
  //       // }
  //     } catch (error) {
  //       console.error('Error processing file:', error);
  //       reject(false);
  //     }
  //   });
  // }
}
