import { IsEmail, IsNumber, IsOptional, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UpdateUserDto {
  @ApiModelProperty()
  @IsEmail()
  email: string;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  @MinLength(10)
  password: string;

  @ApiModelProperty()
  @IsNumber()
  roleId: number;
}
