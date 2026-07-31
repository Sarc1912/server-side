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
    Min,
    IsUrl,
    IsBoolean,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../../../entities/Product';

export class CreateProductImageDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    altText?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    order?: number;

    @IsBoolean()
    @IsOptional()
    isMain?: boolean;
}

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

    // Arreglo opcional de imágenes con validación anidada
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductImageDto)
    @IsOptional()
    images?: CreateProductImageDto[];
}