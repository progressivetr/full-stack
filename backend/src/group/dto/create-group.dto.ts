import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateGroupDto {
  @ApiModelProperty()
  @IsString()
  name: string;
}
