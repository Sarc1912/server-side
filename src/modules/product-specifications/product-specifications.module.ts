import { Module } from '@nestjs/common';
import { ProductSpecificationsService } from './product-specifications.service';
import { ProductSpecificationsController } from './product-specifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSpecification } from '../../entities/ProductSpecification';
import { Product } from '../../entities/Product';

@Module({
  controllers: [ProductSpecificationsController],
  providers: [ProductSpecificationsService],
  imports: [TypeOrmModule.forFeature([ProductSpecification, Product])],
  exports: [ProductSpecificationsService],
})
export class ProductSpecificationsModule { }
