import { Controller, Get, Param, HttpException, HttpStatus, Query, Body, Post } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('auth')
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Get('items')
  async get(@Query() query): Promise<any> {
    try {
      let results = this.itemService.getNearItems({
        latitude: query.latitude, 
        longitude: query.longitude,
        keywords: query.keywords,
        state: query.state,
        category: query.category,
        condition: query.condition
      });
      return results;
    } catch(e) {
      console.log();
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e 
      }, 500);
    }
  }

  @Post('items')
  async post(@Body() data): Promise<any> {
    try {
      let result = this.itemService.postItem(data);
      return result;
    } catch(e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e
      }, 500);
    }
  }
}
