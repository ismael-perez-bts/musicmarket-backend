import { IsString } from 'class-validator';

export class IdDto {

  @IsString()
  recipientUid: number;
}