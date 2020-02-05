import { 
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Query,
  Body,
  Post,
  Req,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtendedRequest } from '../models/extended-request.dto';
import { ItemsService } from './items.service';

@Controller('api')
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Get('items')
  async get(@Query() query): Promise<any> {
    try {
      let results = await this.itemService.getNearItems({
        latitude: query.latitude, 
        longitude: query.longitude,
        keywords: query.keywords,
        state: query.state,
        category: query.category,
        condition: query.condition,
        distance: query.distance,
        min: query.min,
        max: query.max
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

  @Get('items/:id')
  async getSingle(@Param() params): Promise<any> {
    try {
      let results = await this.itemService.getItemById(params.id);
      return { message: 'success', data: results };
    } catch(e) {
      console.log(e);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e 
      }, 500);
    }
  }

  @Get('categories')
  async getCategories() {
    try {
      let results = await this.itemService.getCategories();
      return { message: 'success', data: results };
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e
      }, 500);
    }
  }


  @Post('items')
  @UseInterceptors(FileInterceptor('file'))
  async post(@Body('data') data, @Req() req: ExtendedRequest, @UploadedFile() file): Promise<any> {

    try {
      console.log('test');
      console.log(req.user);
      let user = req.user;
      let parsedData = JSON.parse(data);
      let result = await this.itemService.postItem(parsedData, user.uid, file);
      return { message: 'success', data: result };
    } catch(e) {
      console.log(e);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e
      }, 500);
    }
  }
}
