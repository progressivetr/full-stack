import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Priority } from '@prisma/client';

export class GetTodosRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value ? value === 'true' : null))
  isDone?: boolean;

  @Type(() => Number)
  @IsOptional()
  group?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Priority, { each: true })
  priorities?: Priority[];

  @Type(() => Number)
  @IsOptional()
  startDate?: number;

  @Type(() => Number)
  @IsOptional()
  endDate?: number;
}
