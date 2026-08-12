import { IsOptional, IsString } from 'class-validator';

export class RejectLoanApplicationDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
