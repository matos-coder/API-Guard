import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { CreateAnalyzeDto } from './dto/create-analyze.dto';
import { UpdateAnalyzeDto } from './dto/update-analyze.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  @HttpCode(HttpStatus.OK) 
  async analyze(@Body() dto: CreateAnalyzeDto) {
    const result = await this.analyzeService.analyzeTraffic(dto);
    return result;
  }
}
