import { PartialType } from '@nestjs/mapped-types';
import { CreateAnalyzeDto } from './create-analyze.dto';

export class UpdateAnalyzeDto extends PartialType(CreateAnalyzeDto) {}
