import {
    IsInt,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsPositive,
    MaxLength,
    Length,
    IsEnum,
    IsObject,
    Min
} from 'class-validator';
import { ProductStatus } from '../../../entities/Product';

export class CreateProductDto {
    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    title: string;

    @IsString()
    @MaxLength(100)
    @IsOptional()
    brand?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @IsNotEmpty()
    basePrice: number;

    @IsString()
    @Length(3, 3)
    @IsOptional()
    currency?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    stockQuantity?: number;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @IsObject()
    @IsOptional()
    attributes?: Record<string, any>;
}