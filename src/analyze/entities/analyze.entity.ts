import { PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export enum SignatureType {
  USER_AGENT = 'USER_AGENT',
  IP_RANGE = 'IP_RANGE',
  HEADER_PATTERN = 'HEADER_PATTERN',
}

export class Analyze {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SignatureType })
  type: SignatureType;

  @Index() // Crucial for performance
  @Column()
  pattern: string;

  @Column({ default: 'BLOCK' })
  action: 'BLOCK' | 'FLAG' | 'CAPTCHA';

  @Column({ default: true })
  isActive: boolean;
}
