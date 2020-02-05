import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Param,
  Put,
  UseInterceptors,
  Body,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtendedRequest } from '../models/extended-request.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {

  }

  @Get('id/:id')
  async getById(@Param() params): Promise<any> {
    try {
      let user = await this.usersService.getUser(params.id);

      return { message: 'success', data: user };
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e 
      }, 500);
    }
  }

  @Get('self')
  async getSelf(@Req() req: ExtendedRequest): Promise<any> {
    try {
      console.log('req', req.user);
      let user = await this.usersService.getSelf(req.user.uid);
      console.log('user: ', user);
      return { message: 'success', data: user };
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e 
      }, 500);
    }
  }

  @Put('self')
  @UseInterceptors(FileInterceptor('file'))
  async postSelf(@Body('data') data, @Req() req: ExtendedRequest, @UploadedFile() file): Promise<any> {
    try {
      let user = req.user;
      let parsedData = JSON.parse(data);
      let results = await this.usersService.putProfile(parsedData, user, file);
      return { message: 'success', data: results };
    } catch (e) {
      console.log(e);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e 
      }, 500); 
    }
  }

  @Get('items/:uid')
  async getItems(@Param() params): Promise<any> {
    try {
      let results = await this.usersService.getUserItems(params.uid);

      return { message: 'success', data: results };
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: e 
      }, 500); 
    }
  }
}
