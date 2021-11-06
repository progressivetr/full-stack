import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule, TodoModule, GroupModule],
})
export class AppModule {}
