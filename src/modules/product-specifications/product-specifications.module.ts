import { Module } from '@nestjs/common';
import { ProductSpecificationsService } from './product-specifications.service';
import { ProductSpecificationsController } from './product-specifications.controller';

@Module({
  controllers: [ProductSpecificationsController],
  providers: [ProductSpecificationsService],
})
export class ProductSpecificationsModule {}
