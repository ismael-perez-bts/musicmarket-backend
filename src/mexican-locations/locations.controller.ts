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
import { LocationsService } from './locations.service';

@Controller('api/states')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get()
  async get(@Query() query): Promise<any> {
    try {
      let stateId = query.state;

      let results = await this.locationsService.getState(stateId);

      return results;

    } catch(e) {
      console.log();
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e 
      }, 500);
    }
  }

  @Get(':id')
  async getCities(@Param() params): Promise<any> {
    try {
      let stateId = params.id;

      let results = await this.locationsService.getCitiesByState(stateId);
      return { message: 'success', data: results };

    } catch(e) {
      console.log(e);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e 
      }, 500);
    }
  }
}