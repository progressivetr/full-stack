import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;

  @ApiProperty()
  roleId: number;

  @ApiProperty()
  createdAt: Date;
}
