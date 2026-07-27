import { IsString, IsNotEmpty, MaxLength, IsOptional, IsNumber } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'El slug es obligatorio' })
    @MaxLength(100, { message: 'El slug no puede exceder los 100 caracteres' })
    slug: string;

    @IsOptional()
    @IsNumber({}, { message: 'El ID de la categoría padre debe ser un número' })
    parentId?: number;
}