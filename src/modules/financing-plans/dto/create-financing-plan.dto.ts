import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PaymentFrequency } from '../../../entities/FinancingPlan';

export class CreateFinancingPlanDto {
  @IsInt()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  productId: number;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El título no puede exceder los 100 caracteres' })
  title?: string;

  @IsInt()
  @Min(1, { message: 'El número de cuotas debe ser al menos 1' })
  numberOfInstallments: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El monto de la cuota no puede ser negativo' })
  installmentAmount: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El enganche no puede ser negativo' })
  downPayment?: number;

  @IsOptional()
  @IsEnum(PaymentFrequency, { message: 'La frecuencia de pago no es válida' })
  frequency?: PaymentFrequency;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'La tasa de interés no puede ser negativa' })
  interestRateApr?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
