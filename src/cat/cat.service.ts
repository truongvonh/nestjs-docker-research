import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateCatDTO } from './dto/cat.dto';
import { CatModel } from './cat.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CatService {
  constructor(@InjectModel(CatModel.name) private catModel: Model<CatModel>) {}

  async createCat(createCatDTO: CreateCatDTO): Promise<CatModel> {
    return new this.catModel(createCatDTO).save();
  }

  async findAll(): Promise<CatModel[]> {
    return this.catModel.find().exec();
  }
}
