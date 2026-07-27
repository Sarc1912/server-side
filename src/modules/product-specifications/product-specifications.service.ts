import { Injectable } from '@nestjs/common';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Injectable()
export class ProductSpecificationsService {
  create(createProductSpecificationDto: CreateProductSpecificationDto) {
    return 'This action adds a new productSpecification';
  }

  findAll() {
    return `This action returns all productSpecifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productSpecification`;
  }

  update(id: number, updateProductSpecificationDto: UpdateProductSpecificationDto) {
    return `This action updates a #${id} productSpecification`;
  }

  remove(id: number) {
    return `This action removes a #${id} productSpecification`;
  }
}
