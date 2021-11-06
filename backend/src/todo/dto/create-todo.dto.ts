import { IsEnum, IsInt, IsString } from 'class-validator';
import { Priority } from '@prisma/client';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class CreateTodoDto {
  @ApiModelProperty()
  @IsString()
  text: string;

  @ApiModelProperty()
  @IsEnum(Priority)
  priority: Priority;

  @ApiModelProperty()
  @IsInt()
  groupId: number;

  @ApiModelProperty()
  @IsInt()
  dueDate: number;
}
