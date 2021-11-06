import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateRoleDto {
  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsArray()
  @IsNumber()
  permissions: number[];
}
