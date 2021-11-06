import { Group } from '@prisma/client';

export interface GetGroupsResponseDto {
  data: Group[];

  total: number;
}
