import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { AnalyzeService } from './analyze.service';
import { AnalyzeController } from './analyze.controller';
import { Analyze } from './entities/analyze.entity';
import { SeedController } from './seed';

@Module({
  imports: [TypeOrmModule.forFeature([Analyze])],
  controllers: [AnalyzeController, SeedController],
  providers: [AnalyzeService, {
    provide: 'REDIS_CLIENT',
    useFactory: () => {
      return new Redis({
        host: 'localhost',
        port: 6379,
      });
    },
  }],
})
export class AnalyzeModule {}
