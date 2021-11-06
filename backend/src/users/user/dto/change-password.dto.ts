import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ChangePasswordDto {
  @ApiModelProperty()
  @IsString()
  old: string;

  @ApiModelProperty()
  @IsString()
  new: string;
}
