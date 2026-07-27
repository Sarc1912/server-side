import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSpecificationDto } from './create-product-specification.dto';

export class UpdateProductSpecificationDto extends PartialType(CreateProductSpecificationDto) {}
