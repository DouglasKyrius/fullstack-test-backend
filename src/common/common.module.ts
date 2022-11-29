import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { GraphqlModule } from './graphql.module';

@Module({
  imports: [AuthModule, ConfigModule, GraphqlModule, MongoModule],
  exports: [AuthModule, ConfigModule, GraphqlModule, MongoModule],
})
export class CommonModule {}
