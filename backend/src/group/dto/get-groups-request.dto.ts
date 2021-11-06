import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class GetGroupsRequestDto {
  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}
