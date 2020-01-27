import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/config.provider';

@Injectable()
export class CategoriesService {

  constructor(private readonly db: DatabaseService) {}

  public getCategories() {

  }
}