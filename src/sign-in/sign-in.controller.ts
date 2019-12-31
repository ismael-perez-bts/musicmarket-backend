import { Controller, Get, Post, Body } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { SignInDto } from '../models/sign-in.dto';

@Controller('auth')
export class SignInController {
  constructor(private signInService: SignInService) {}

  @Post('sign-up')
  async signUp(@Body() signInDto: SignInDto): Promise<any> {
    console.log(signInDto);
    let user = this.signInService.signUp(signInDto);
    return user;
  }

  @Post('sign-in')
  async signIn(@Body() data: any): Promise<any> {
    try {
      let user = await this.signInService.signInOrCreate(data.idToken)

      console.log(user);
      return user;
    } catch (e) {
      return e;
    }
  }
}
