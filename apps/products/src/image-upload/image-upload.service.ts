import { Injectable } from '@nestjs/common';
import { ImageUpload } from './entities/image-upload.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { join } from 'path';

@Injectable()
export class ImageUploadService {
  constructor(
    @InjectModel(ImageUpload.name)
    private readonly imageModel: Model<ImageUpload>,
  ) {}

  async processUploadedFiles(files: ImageUpload[]): Promise<ImageUpload[]> {
    const images: ImageUpload[] = [];
    for (const file of files) {
      const { filename, mimetype, encoding } = file;
      const newImage = await this.imageModel.create({
        title: filename,
        description: filename + ' is the file from image upload service',
        filename,
        mimetype,
        encoding,
        imageUri: join(__dirname, '..', '..', '..', 'uploads', `${filename}`),
      });

      images.push(newImage);
    }
    return images;
  }

  // get
  async getSavedImages(): Promise<ImageUpload[]> {
    return this.imageModel.find();
  }

  getImageUrl(filename: string): string | PromiseLike<string> {
    // const imagePath = join(
    //   __dirname,
    //   '..',
    //   '..',
    //   '..',
    //   'uploads',
    //   `${filename}`,
    // );
    // In a real-world scenario, you might want to handle errors and security considerations here.
    return `http://localhost:3001/uploads/${filename}`;
  }
}
