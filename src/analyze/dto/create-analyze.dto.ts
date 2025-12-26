import { IsIP, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAnalyzeDto {
  @IsIP()
  @IsNotEmpty()
  ip: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @IsString()
  @IsOptional()
  method?: string; // GET, POST - bots often use HEAD

  @IsString()
  @IsOptional()
  path?: string; // /wp-login.php is a dead giveaway
}
