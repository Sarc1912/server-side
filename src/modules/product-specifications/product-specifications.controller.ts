import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductSpecificationsService } from './product-specifications.service';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Controller('product-specifications')
export class ProductSpecificationsController {
  constructor(private readonly productSpecificationsService: ProductSpecificationsService) { }

  @Post()
  create(@Body() createProductSpecificationDto: CreateProductSpecificationDto) {
    return this.productSpecificationsService.create(createProductSpecificationDto);
  }

  @Get()
  findAll() {
    return this.productSpecificationsService.findAll();
  }

  @Get('product/:productId')
  findByProductId(@Param('productId') productId: string) {
    return this.productSpecificationsService.findByProductId(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productSpecificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductSpecificationDto: UpdateProductSpecificationDto) {
    return this.productSpecificationsService.update(+id, updateProductSpecificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSpecificationsService.remove(+id);
  }
}