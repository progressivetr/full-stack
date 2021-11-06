import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiModelProperty()
  @IsBoolean()
  isDone: boolean;
}
