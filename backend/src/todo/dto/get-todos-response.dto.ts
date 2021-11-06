import { Todo } from '@prisma/client';

export interface GetTodosResponseDto {
  data: Todo[];
  total: number;
}
