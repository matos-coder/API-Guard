import { Controller, Post } from '@nestjs/common';
import { Analyze, SignatureType } from './entities/analyze.entity';
import { Repository } from 'typeorm';
import { AnalyzeService } from './analyze.service';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('seed')
export class SeedController {
  constructor(
    @InjectRepository(Analyze)
    private signatureRepo: Repository<Analyze>,
    private analyzeService: AnalyzeService,
  ) {}
  @Post('seed-defaults')
  async seed() {
    // 1. Add known bad bots
    const bots = ['curl', 'python-requests', 'wget', 'scrapy', 'bot'];
    for (const bot of bots) {
      await this.signatureRepo.save({
        type: SignatureType.USER_AGENT,
        pattern: bot,
        action: 'BLOCK',
        isActive: true,
      });
    }
    // 2. Refresh memory
    await this.analyzeService.refreshRules();
    return { status: 'seeded' };
  }
}
