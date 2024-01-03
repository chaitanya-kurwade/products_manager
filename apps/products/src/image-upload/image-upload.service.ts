import { Injectable } from '@nestjs/common';
import { ImageUpload } from './entities/image-upload.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ImageUploadService {
  constructor(
    @InjectModel(ImageUpload.name) private readonly imageModel: Model<ImageUpload>,
  ) {}

  async processUploadedFiles(files: ImageUpload[]): Promise<ImageUpload[]> {
    const images: ImageUpload[] = [];
    for (const file of files) {
      const { filename, mimetype, encoding } = file;
      const newImage = await this.imageModel.create({
        title: 'storage_'+file+".jpg", 
        description: 'storage_'+file+".jpg is the file from image upload service", 
        filename,
        mimetype,
        encoding,
      });
      images.push(newImage);
    }
    return await this.imageModel.create(images);
  }
  
  // get
  async getSavedImages(): Promise<ImageUpload[]> {
    return this.imageModel.find();
  }

  // create(createImageUploadInput: CreateImageUploadInput) {
  //   return 'This action adds a new imageUpload';
  // }

  // findAll() {
  //   return `This action returns all imageUpload`;
  // }

  // findOne(_id: string) {
  //   return `This action returns a #${_id} imageUpload`;
  // }

  // update(_id: string, updateImageUploadInput: UpdateImageUploadInput) {
  //   return `This action updates a #${_id} imageUpload`;
  // }

  // remove(_id: string) {
  //   return `This action removes a #${_id} imageUpload`;
  // }
}

// // src/services/upload.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Image } from '../entities/image.entity';

// @Injectable()
// export class UploadService {
//   constructor(
//     @InjectRepository(Image)
//     private readonly imageRepository: Repository<Image>,
//   ) {}

//   async processUploadedFiles(files: any[]): Promise<void> {
//     const images: Image[] = [];

//     for (const file of files) {
//       const { filename, mimetype, encoding } = file;

//       const newImage = this.imageRepository.create({
//         title: 'Default Title', // You can customize this based on your needs
//         description: 'Default Description', // You can customize this based on your needs
//         filename,
//         mimetype,
//         encoding,
//       });

//       images.push(newImage);
//     }

//     await this.imageRepository.save(images);
//   }

//   async getSavedImages(): Promise<Image[]> {
//     return this.imageRepository.find();
//   }
// }
