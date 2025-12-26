import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalyzeModule } from './analyze/analyze.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analyze } from './analyze/entities/analyze.entity';

@Module({
  imports: [AnalyzeModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'guard_db',
      entities: [Analyze],
      synchronize: true, // Auto-create tables (Dev only)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
