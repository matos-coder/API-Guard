import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { Analyze, SignatureType } from './entities/analyze.entity';
import { CreateAnalyzeDto } from './dto/create-analyze.dto';
import * as crypto from 'crypto';
@Injectable()
export class AnalyzeService implements OnModuleInit {
  constructor(
    @InjectRepository(Analyze)
    private signatureRepo: Repository<Analyze>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  private uaPatterns: string[] = [];
  private pathBlocklist: string[] = [];

  async onModuleInit() {
    await this.refreshRules();
  }

  // Call this when you add a new rule via API so you don't need to restart
  async refreshRules() {
    const signatures = await this.signatureRepo.find({ where: { isActive: true } });
    
    // Separate into categories for speed
    this.uaPatterns = signatures
      .filter(s => s.type === SignatureType.USER_AGENT)
      .map(s => s.pattern.toLowerCase());
      
    this.pathBlocklist = signatures
      .filter(s => s.type === SignatureType.PATH_PATTERN)
      .map(s => s.pattern.toLowerCase());
      
    console.log(`[Guard] Loaded ${this.uaPatterns.length} UA rules`);
  }

  async analyzeTraffic(dto: CreateAnalyzeDto) {
    const { ip, userAgent, path } = dto;
    const uaHash = crypto.createHash('md5').update(userAgent).digest('hex');
    const cacheKey = `guard:decision:${ip}:${uaHash}`;

    // L1: Redis Check
    const cachedDecision = await this.redis.get(cacheKey);
    if (cachedDecision) {
      return JSON.parse(cachedDecision);
    }

    // L2: Deep Analysis (Memory Check - Very Fast)
    const decision = this.performDeepAnalysis(ip, userAgent, path);

    if (decision.action === 'BLOCK') {
       await this.redis.set(cacheKey, JSON.stringify(decision), 'EX', 3600);
    } else {
       await this.redis.set(cacheKey, JSON.stringify(decision), 'EX', 60);
    }

    return decision;
  }

  private performDeepAnalysis(ip: string, userAgent: string, path?: string) {
    const lowerUA = userAgent.toLowerCase();

    if (path) {
      const isBadPath = this.pathBlocklist.some(p => path.toLowerCase().includes(p));
      if (isBadPath) {
        return { action: 'BLOCK', reason: 'FORBIDDEN_PATH' };
      }
    }

    const matchedPattern = this.uaPatterns.find(pattern => lowerUA.includes(pattern));
    
    if (matchedPattern) {
        return { action: 'BLOCK', reason: `BAD_USER_AGENT:${matchedPattern}` };
    }

    // 3. (Future) Rate Limiting & Geo Logic goes here
    
    return { action: 'ALLOW' };
  }
}
