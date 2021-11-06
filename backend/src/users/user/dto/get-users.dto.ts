import { IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class GetUsersDto {
  @ApiModelProperty()
  @IsInt()
  page: number;

  @ApiModelProperty()
  @IsInt()
  limit: number;
}
