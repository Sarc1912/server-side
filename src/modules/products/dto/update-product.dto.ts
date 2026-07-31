import { PartialType } from '@nestjs/mapped-types'; // o '@nestjs/swagger' según uses
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    // Agrega esta línea para que TypeScript la reconozca al recibir el FormData
    existingImages?: string | any[];
}