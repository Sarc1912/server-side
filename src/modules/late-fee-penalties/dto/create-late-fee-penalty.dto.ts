import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateLateFeePenaltyDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID del préstamo es obligatorio' })
  loanId: number;

  @IsInt()
  @IsNotEmpty({ message: 'El ID de la cuota es obligatorio' })
  scheduleItemId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El monto de la penalidad no puede ser negativo' })
  penaltyAmount: number;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'La razón no puede exceder los 255 caracteres' })
  reason?: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
