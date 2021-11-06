import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateUserDto {
  @ApiModelProperty()
  @IsEmail()
  email: string;

  @ApiModelProperty()
  @IsString()
  @MinLength(10)
  password: string;

  @ApiModelProperty()
  @IsNumber()
  roleId: number;
}
