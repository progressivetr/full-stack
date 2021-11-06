import { IsInt } from 'class-validator';

export class GetRolesDto {
  @IsInt()
  page: number;

  @IsInt()
  limit: number;
}
